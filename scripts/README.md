# Database Analysis Scripts

This directory contains utility scripts for analyzing and documenting the OMS database.

## Scripts

### `analyze-database.ts`

Comprehensive database analysis script that:
- Connects to the OMS MySQL database
- Introspects all tables, columns, indexes, and foreign keys
- Generates a detailed markdown report with:
  - Table purposes and descriptions
  - Column definitions with inferred purposes
  - Relationship diagrams (Mermaid ERD)
  - Index documentation
  - Summary statistics

## Usage

### Prerequisites

Make sure your `.env` file has the correct database credentials:
```env
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=oms
DB_PORT=3306
```

### Running the Analysis

From the OMS root directory:

```bash
# Install dependencies (first time only)
cd scripts
npm install
cd ..

# Run the analysis
npm run analyze-db
```

Or directly with tsx:

```bash
npx tsx scripts/analyze-database.ts
```

### Output

The script generates `database_analysis.md` in the root directory containing:

1. **Table of Contents** - Quick navigation to all tables
2. **Detailed Table Documentation** - For each table:
   - Purpose and description
   - Column definitions with types and constraints
   - Foreign key relationships
   - Index information
3. **ER Diagram** - Visual representation of relationships (Mermaid format)
4. **Summary Statistics** - Database metrics and insights

## Example Output Structure

```markdown
# OMS Database Schema Analysis

## organizations
### Purpose
Multi-tenant root table storing organization/company information.

### Columns
| Column | Type | Nullable | Key | Default | Extra | Description |
|--------|------|----------|-----|---------|-------|-------------|
| id | int | NO | PRI | NULL | auto_increment | Primary key |
| name | text | NO | | NULL | | Name field |
...

### Relationships
| Column | References | Description |
|--------|------------|-------------|
| org_id | organizations.id | Belongs to organization |
...
```

## Customization

You can modify `analyze-database.ts` to:
- Change output format (JSON, HTML, etc.)
- Add custom analysis logic
- Filter specific tables
- Generate different diagram types
- Add data sampling or statistics
