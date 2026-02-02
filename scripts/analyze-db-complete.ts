import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../shared/schema';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function analyzeDatabase() {
  console.log('Starting complete database analysis...');
  
  try {
    // Connect to database using environment variables or default values
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'hussain12',
      database: process.env.DB_DATABASE || 'oms'
    });

    const db = drizzle(connection, { mode: 'default', schema });

    // Get all table names from the schema
    const tableNames = Object.keys(schema).filter(key => 
      typeof (schema as any)[key]?.table === 'object'
    );

    console.log(`Found ${tableNames.length} tables in the schema:`, tableNames);

    // Analyze each table
    const analysisResults: any = {};

    for (const tableName of tableNames) {
      const tableSchema = (schema as any)[tableName].table;
      
      console.log(`\nAnalyzing table: ${tableName}`);
      
      // Get table structure
      const tableInfo: any = {
        tableName: tableName,
        columns: [],
        indexes: [],
        foreignKeys: [],
        primaryKey: null,
        constraints: []
      };

      // Extract column information
      const columns = tableSchema._.columns;
      for (const [colName, colDef] of Object.entries(columns) as [string, any][]) {
        const colInfo = {
          name: colName,
          dataType: colDef.dataType,
          notNull: colDef.notNull,
          default: colDef.default,
          primaryKey: colDef.primary,
          autoIncrement: colDef.autoIncrement,
          hasDefault: colDef.hasDefault,
          enumValues: colDef.enumValues,
          baseName: colDef.baseName,
          tableName: colDef.tableName,
          sqlName: colDef.sqlName,
          isUnique: colDef.unique
        };
        
        tableInfo.columns.push(colInfo);
        
        // Identify primary key
        if (colDef.primary) {
          tableInfo.primaryKey = colName;
        }
      }

      // Get foreign key information from the schema
      if (tableSchema._.foreignKeys) {
        for (const fk of tableSchema._.foreignKeys) {
          const fkInfo = {
            name: fk.name,
            columns: fk.columns.map((col: any) => col.name),
            referencedTable: fk.reference().refTableConfig.schema,
            referencedColumns: fk.reference().refTableConfig.columns.map((col: any) => col.name)
          };
          
          tableInfo.foreignKeys.push(fkInfo);
        }
      }

      // Get index information
      if (tableSchema._.indexes) {
        for (const [idxName, idxDef] of Object.entries(tableSchema._.indexes) as [string, any][]) {
          const idxInfo = {
            name: idxName,
            columns: Array.isArray(idxDef.config.columns) 
              ? idxDef.config.columns.map((col: any) => col.name) 
              : [idxDef.config.columns.name],
            unique: idxDef.config.unique || false
          };
          
          tableInfo.indexes.push(idxInfo);
        }
      }

      analysisResults[tableName] = tableInfo;
      console.log(`Completed analysis for table: ${tableName}`);
    }

    // Also get actual database structure via raw SQL queries
    console.log('\nFetching actual database structure via SQL queries...');
    
    // Get all tables from the database
    const [tablesResult] = await connection.execute('SHOW TABLES');
    const actualTables: string[] = [];
    
    if (Array.isArray(tablesResult)) {
      for (const row of tablesResult) {
        const tableName = Object.values(row)[0] as string;
        actualTables.push(tableName);
      }
    }
    
    console.log(`Found ${actualTables.length} tables in the actual database:`, actualTables);

    // Compare schema vs actual database
    const missingInDb = tableNames.filter(name => !actualTables.includes(name));
    const extraInDb = actualTables.filter(name => !tableNames.includes(name));
    
    console.log('\nComparison Summary:');
    console.log(`Tables in schema but not in DB:`, missingInDb);
    console.log(`Tables in DB but not in schema:`, extraInDb);

    // Analyze each table in the actual database
    for (const tableName of actualTables) {
      console.log(`\nDetailed analysis for actual table: ${tableName}`);
      
      // Get column info
      const [columnsResult] = await connection.execute(`DESCRIBE \`${tableName}\``);
      console.log(`  Columns in ${tableName}:`);
      
      if (Array.isArray(columnsResult)) {
        for (const col of columnsResult) {
          console.log(`    - ${(col as any).Field}: ${(col as any).Type}${(col as any).Null === 'NO' ? ' NOT NULL' : ''}${(col as any).Key ? ` KEY(${(col as any).Key})` : ''}${(col as any).Extra ? ` ${(col as any).Extra}` : ''}`);
        }
      }
      
      // Get foreign key constraints
      const [fkResult] = await connection.execute(`
        SELECT 
          CONSTRAINT_NAME,
          COLUMN_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL
      `, [process.env.DB_NAME || 'oms_db', tableName]);
      
      console.log(`  Foreign Keys in ${tableName}:`);
      if (Array.isArray(fkResult) && fkResult.length > 0) {
        for (const fk of fkResult) {
          console.log(`    - ${(fk as any).COLUMN_NAME} -> ${(fk as any).REFERENCED_TABLE_NAME}.${(fk as any).REFERENCED_COLUMN_NAME}`);
        }
      } else {
        console.log('    None');
      }
      
      // Get indexes
      const [indexResult] = await connection.execute(`SHOW INDEX FROM \`${tableName}\``);
      console.log(`  Indexes in ${tableName}:`);
      if (Array.isArray(indexResult)) {
        const indexes: Record<string, any[]> = {};
        for (const idx of indexResult as any[]) {
          if (!indexes[(idx as any).Key_name]) {
            indexes[(idx as any).Key_name] = [];
          }
          indexes[(idx as any).Key_name].push({
            column: (idx as any).Column_name,
            seq: (idx as any).Seq_in_index,
            unique: (idx as any).Non_unique === 0
          });
        }
        
        for (const [idxName, idxCols] of Object.entries(indexes)) {
          const unique = (idxCols[0] as any).unique ? 'UNIQUE ' : '';
          const cols = idxCols.map(c => (c as any).column).join(', ');
          console.log(`    - ${unique}${idxName}: ${cols}`);
        }
      }
    }

    // Generate comprehensive report
    const report = {
      timestamp: new Date().toISOString(),
      schemaAnalysis: analysisResults,
      databaseStructure: {
        tables: actualTables,
        missingInDb,
        extraInDb
      },
      summary: {
        totalSchemaTables: tableNames.length,
        totalDbTables: actualTables.length,
        schemaMatchesDb: missingInDb.length === 0 && extraInDb.length === 0
      }
    };

    // Write report to file
    const outputPath = path.join(__dirname, '..', 'database_complete_analysis_report.json');
    await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
    
    console.log(`\nComplete database analysis saved to: ${outputPath}`);
    console.log('\nDatabase Analysis Summary:');
    console.log(`- Total tables in schema: ${report.summary.totalSchemaTables}`);
    console.log(`- Total tables in database: ${report.summary.totalDbTables}`);
    console.log(`- Schema matches database: ${report.summary.schemaMatchesDb ? 'YES' : 'NO'}`);
    
    if (!report.summary.schemaMatchesDb) {
      console.log('\n⚠️  Database schema does not match Drizzle schema!');
      if (missingInDb.length > 0) {
        console.log(`Missing in DB: ${missingInDb.join(', ')}`);
      }
      if (extraInDb.length > 0) {
        console.log(`Extra in DB: ${extraInDb.join(', ')}`);
      }
    } else {
      console.log('\n✅ Database schema matches Drizzle schema perfectly!');
    }

    await connection.end();
  } catch (error) {
    console.error('Error during database analysis:', error);
    throw error;
  }
}

// Run the analysis
const isMain = typeof require !== 'undefined' ? require.main === module : process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  analyzeDatabase()
    .catch(console.error)
    .finally(() => {
      console.log('Database analysis completed.');
    });
}