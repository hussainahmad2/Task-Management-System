import "dotenv/config";
import { pool } from "../server/db.js";
import { RowDataPacket } from "mysql2";
import * as fs from "fs";
import * as path from "path";

/**
 * OMS Database Analysis Script
 * 
 * This script analyzes the OMS database structure and generates a comprehensive
 * markdown report documenting all tables, columns, relationships, and their functions.
 */

interface TableInfo {
    tableName: string;
    columns: ColumnInfo[];
    indexes: IndexInfo[];
    foreignKeys: ForeignKeyInfo[];
}

interface TableRow extends RowDataPacket {
    TABLE_NAME: string;
}

interface ColumnInfo extends RowDataPacket {
    name: string;
    type: string;
    nullable: string;
    key: string;
    default: string | null;
    extra: string;
}

interface IndexInfo extends RowDataPacket {
    keyName: string;
    columnName: string;
    nonUnique: number;
}

interface ForeignKeyInfo extends RowDataPacket {
    constraintName: string;
    columnName: string;
    referencedTable: string;
    referencedColumn: string;
}

async function analyzeDatabase() {
    console.log("🔍 Starting OMS Database Analysis...\n");

    const dbName = process.env.DB_DATABASE || "oms";

    // Get all tables
    const [tables] = await pool.query<TableRow[]>(
        `SELECT TABLE_NAME FROM information_schema.TABLES 
     WHERE TABLE_SCHEMA = ? 
     ORDER BY TABLE_NAME`,
        [dbName]
    );

    const tableInfos: TableInfo[] = [];

    for (const table of tables) {
        const tableName = table.TABLE_NAME;
        console.log(`📊 Analyzing table: ${tableName}`);

        // Get columns
        const [columns] = await pool.query<ColumnInfo[]>(
            `SELECT 
        COLUMN_NAME as name,
        COLUMN_TYPE as type,
        IS_NULLABLE as nullable,
        COLUMN_KEY as \`key\`,
        COLUMN_DEFAULT as \`default\`,
        EXTRA as extra
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION`,
            [dbName, tableName]
        );

        // Get indexes
        const [indexes] = await pool.query<IndexInfo[]>(
            `SELECT 
        INDEX_NAME as keyName,
        COLUMN_NAME as columnName,
        NON_UNIQUE as nonUnique
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY INDEX_NAME, SEQ_IN_INDEX`,
            [dbName, tableName]
        );

        // Get foreign keys
        const [foreignKeys] = await pool.query<ForeignKeyInfo[]>(
            `SELECT 
        CONSTRAINT_NAME as constraintName,
        COLUMN_NAME as columnName,
        REFERENCED_TABLE_NAME as referencedTable,
        REFERENCED_COLUMN_NAME as referencedColumn
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = ?
        AND REFERENCED_TABLE_NAME IS NOT NULL
      ORDER BY ORDINAL_POSITION`,
            [dbName, tableName]
        );

        tableInfos.push({
            tableName,
            columns,
            indexes,
            foreignKeys,
        });
    }

    // Generate markdown report
    const report = generateMarkdownReport(tableInfos, dbName);

    // Save to file
    const outputPath = path.join(process.cwd(), "database_analysis.md");
    fs.writeFileSync(outputPath, report, "utf-8");

    console.log(`\n✅ Analysis complete! Report saved to: ${outputPath}`);

    // Close the pool
    await pool.end();
    process.exit(0);
}

function generateMarkdownReport(tables: TableInfo[], dbName: string): string {
    let md = `# OMS Database Schema Analysis\n\n`;
    md += `**Database**: \`${dbName}\`  \n`;
    md += `**Generated**: ${new Date().toLocaleString()}  \n`;
    md += `**Total Tables**: ${tables.length}\n\n`;

    md += `---\n\n`;

    // Table of Contents
    md += `## 📑 Table of Contents\n\n`;
    tables.forEach((table, idx) => {
        md += `${idx + 1}. [${table.tableName}](#${table.tableName.toLowerCase().replace(/_/g, '-')})\n`;
    });
    md += `\n---\n\n`;

    // Detailed table documentation
    tables.forEach((table) => {
        md += generateTableSection(table);
    });

    // Database relationships diagram
    md += generateRelationshipsDiagram(tables);

    // Summary statistics
    md += generateSummaryStatistics(tables);

    return md;
}

function generateTableSection(table: TableInfo): string {
    let md = `## ${table.tableName}\n\n`;

    // Table purpose (inferred from name and structure)
    md += `### Purpose\n`;
    md += `${inferTablePurpose(table)}\n\n`;

    // Columns
    md += `### Columns\n\n`;
    md += `| Column | Type | Nullable | Key | Default | Extra | Description |\n`;
    md += `|--------|------|----------|-----|---------|-------|-------------|\n`;

    table.columns.forEach((col) => {
        const description = inferColumnPurpose(col.name, col.type, table.tableName);
        md += `| \`${col.name}\` | ${col.type} | ${col.nullable} | ${col.key || '-'} | ${col.default || '-'} | ${col.extra || '-'} | ${description} |\n`;
    });
    md += `\n`;

    // Foreign Keys (Relationships)
    if (table.foreignKeys.length > 0) {
        md += `### Relationships\n\n`;
        md += `| Column | References | Description |\n`;
        md += `|--------|------------|-------------|\n`;

        table.foreignKeys.forEach((fk) => {
            md += `| \`${fk.columnName}\` | \`${fk.referencedTable}.${fk.referencedColumn}\` | ${inferRelationshipPurpose(fk, table.tableName)} |\n`;
        });
        md += `\n`;
    }

    // Indexes
    if (table.indexes.length > 0) {
        const uniqueIndexes = [...new Set(table.indexes.map(i => i.keyName))];
        md += `### Indexes\n\n`;
        md += `| Index Name | Columns | Type |\n`;
        md += `|------------|---------|------|\n`;

        uniqueIndexes.forEach((indexName) => {
            const indexCols = table.indexes.filter(i => i.keyName === indexName);
            const cols = indexCols.map(i => i.columnName).join(', ');
            const type = indexCols[0].nonUnique === 0 ? 'UNIQUE' : 'INDEX';
            md += `| \`${indexName}\` | ${cols} | ${type} |\n`;
        });
        md += `\n`;
    }

    md += `---\n\n`;
    return md;
}

function generateRelationshipsDiagram(tables: TableInfo[]): string {
    let md = `## 🔗 Database Relationships\n\n`;
    md += `\`\`\`mermaid\nerDiagram\n`;

    tables.forEach((table) => {
        table.foreignKeys.forEach((fk) => {
            const relationship = inferRelationshipType(fk, table.tableName);
            md += `    ${fk.referencedTable} ${relationship} ${table.tableName} : "${fk.columnName}"\n`;
        });
    });

    md += `\`\`\`\n\n`;
    return md;
}

function generateSummaryStatistics(tables: TableInfo[]): string {
    let md = `## 📊 Summary Statistics\n\n`;

    const totalColumns = tables.reduce((sum, t) => sum + t.columns.length, 0);
    const totalForeignKeys = tables.reduce((sum, t) => sum + t.foreignKeys.length, 0);
    const totalIndexes = tables.reduce((sum, t) => sum + new Set(t.indexes.map(i => i.keyName)).size, 0);

    md += `- **Total Tables**: ${tables.length}\n`;
    md += `- **Total Columns**: ${totalColumns}\n`;
    md += `- **Total Foreign Keys**: ${totalForeignKeys}\n`;
    md += `- **Total Indexes**: ${totalIndexes}\n\n`;

    // Tables by size (column count)
    md += `### Tables by Column Count\n\n`;
    const sortedTables = [...tables].sort((a, b) => b.columns.length - a.columns.length);
    sortedTables.forEach((table) => {
        md += `- **${table.tableName}**: ${table.columns.length} columns\n`;
    });

    return md;
}

// Helper functions to infer purposes
function inferTablePurpose(table: TableInfo): string {
    const name = table.tableName.toLowerCase();

    const purposes: Record<string, string> = {
        'users': 'Stores user authentication and profile information for the system.',
        'sessions': 'Manages user session data for authentication persistence.',
        'organizations': 'Multi-tenant root table storing organization/company information.',
        'departments': 'Organizational structure - departments within organizations.',
        'employees': 'Links users to organizations with employment details and hierarchy.',
        'tasks': 'Task management system with ClickUp-style features.',
        'time_logs': 'Time tracking entries for tasks and employees.',
        'performance_metrics': 'Weekly performance analytics for employees.',
        'permissions': 'RBAC permission definitions.',
        'role_permissions': 'Junction table mapping roles to permissions.',
        'conversations': 'Chat conversation threads.',
        'messages': 'Individual messages within conversations.',
    };

    return purposes[name] || `Stores ${name.replace(/_/g, ' ')} data.`;
}

function inferColumnPurpose(colName: string, colType: string, tableName: string): string {
    const name = colName.toLowerCase();

    if (name === 'id') return 'Primary key';
    if (name.endsWith('_id')) return `Foreign key to ${name.replace('_id', '')} table`;
    if (name === 'created_at') return 'Timestamp of record creation';
    if (name === 'updated_at') return 'Timestamp of last update';
    if (name === 'deleted_at') return 'Soft delete timestamp';
    if (name.includes('email')) return 'Email address';
    if (name.includes('password')) return 'Hashed password';
    if (name.includes('username')) return 'Unique username';
    if (name.includes('name')) return 'Name field';
    if (name.includes('slug')) return 'URL-friendly identifier';
    if (name.includes('status')) return 'Status indicator';
    if (name.includes('role')) return 'Role/permission level';
    if (name.includes('type')) return 'Type classification';
    if (name.includes('date')) return 'Date field';
    if (name.includes('time')) return 'Time/timestamp field';
    if (name.includes('is_')) return 'Boolean flag';
    if (name.includes('salary')) return 'Salary amount';
    if (name.includes('rate')) return 'Percentage rate';
    if (name.includes('score')) return 'Calculated score';

    return 'Data field';
}

function inferRelationshipPurpose(fk: ForeignKeyInfo, tableName: string): string {
    if (fk.columnName === 'org_id') return 'Belongs to organization (multi-tenancy)';
    if (fk.columnName === 'user_id') return 'Links to user account';
    if (fk.columnName === 'department_id') return 'Belongs to department';
    if (fk.columnName === 'manager_id') return 'Reports to manager (hierarchy)';
    if (fk.columnName === 'assignee_id') return 'Assigned to employee';
    if (fk.columnName === 'created_by_id') return 'Created by employee';
    if (fk.columnName === 'employee_id') return 'Associated with employee';
    if (fk.columnName === 'task_id') return 'Associated with task';
    if (fk.columnName === 'permission_id') return 'Links to permission';
    if (fk.columnName === 'parent_task_id') return 'Subtask relationship';
    if (fk.columnName === 'conversation_id') return 'Belongs to conversation';

    return `References ${fk.referencedTable}`;
}

function inferRelationshipType(fk: ForeignKeyInfo, tableName: string): string {
    // Determine cardinality
    if (fk.columnName === 'org_id') return '||--o{';
    if (fk.columnName === 'manager_id') return '||--o{';
    if (fk.columnName === 'parent_task_id') return '||--o{';

    return '||--o{'; // Default: one-to-many
}

// Run the analysis
analyzeDatabase().catch((error) => {
    console.error("❌ Error analyzing database:", error);
    process.exit(1);
});
