import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import * as fs from 'fs';
import * as path from 'path';

interface TableSchema {
  name: string;
  columns: ColumnSchema[];
  constraints: string[];
  comment?: string;
}

interface ColumnSchema {
  name: string;
  type: string;
  nullable: boolean;
  default?: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  isUnique?: boolean;
}

interface EnumSchema {
  name: string;
  values: string[];
}

@Injectable()
export class SchemaFileGeneratorService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async generateFromSchemaFile(filePath: string): Promise<string> {
    try {
      // Read and parse the schema file
      const schemaContent = fs.readFileSync(filePath, 'utf8');
      const tables = this.parseTablesFromSchema(schemaContent);
      const enums = this.parseEnumsFromSchema(schemaContent);

      let documentation = this.generateHeader();
      documentation += this.generateOverview(tables, enums);
      documentation += this.generateTableOfContents(tables);
      documentation += this.generateEnumsSection(enums);

      // Generate detailed documentation for each table
      for (const table of tables) {
        const liveData = await this.getLiveTableData(table.name);
        documentation += this.generateTableDocumentation(table, liveData);
      }

      documentation += this.generateFooter();
      return documentation;

    } catch (error) {
      console.error('Error generating schema documentation:', error);
      throw new Error(`Failed to generate schema documentation: ${error.message}`);
    }
  }

  private parseTablesFromSchema(schemaContent: string): TableSchema[] {
    const tables: TableSchema[] = [];
    
    // Find all CREATE TABLE public.* statements
    const tableRegex = /CREATE TABLE public\.(\w+) \s*\(([\s\S]*?)\);/g;
    let match;

    while ((match = tableRegex.exec(schemaContent)) !== null) {
      const tableName = match[1];
      const tableBody = match[2];
      
      const table: TableSchema = {
        name: tableName,
        columns: this.parseColumns(tableBody),
        constraints: this.parseConstraints(tableBody)
      };

      tables.push(table);
    }

    return tables.sort((a, b) => a.name.localeCompare(b.name));
  }

  private parseColumns(tableBody: string): ColumnSchema[] {
    const columns: ColumnSchema[] = [];
    const lines = tableBody.split('\n').map(line => line.trim()).filter(line => line);

    for (const line of lines) {
      // Skip constraint lines
      if (line.startsWith('CONSTRAINT') || line.startsWith('PRIMARY KEY') || 
          line.startsWith('FOREIGN KEY') || line.startsWith('UNIQUE')) {
        continue;
      }

      // Parse column definition
      const columnMatch = line.match(/^"?(\w+)"?\s+([^,\s]+(?:\s*\([^)]+\))?)\s*(.*?)(?:,\s*)?$/);
      if (columnMatch) {
        const [, columnName, columnType, rest] = columnMatch;
        
        const column: ColumnSchema = {
          name: columnName,
          type: this.normalizeColumnType(columnType),
          nullable: !rest.includes('NOT NULL'),
          default: this.extractDefault(rest),
          isPrimary: rest.includes('PRIMARY KEY'),
        };

        columns.push(column);
      }
    }

    return columns;
  }

  private parseConstraints(tableBody: string): string[] {
    const constraints: string[] = [];
    const lines = tableBody.split('\n').map(line => line.trim()).filter(line => line);

    for (const line of lines) {
      if (line.startsWith('CONSTRAINT') || line.startsWith('PRIMARY KEY') || 
          line.startsWith('FOREIGN KEY') || line.startsWith('UNIQUE')) {
        constraints.push(line.replace(/,$/, ''));
      }
    }

    return constraints;
  }

  private parseEnumsFromSchema(schemaContent: string): EnumSchema[] {
    const enums: EnumSchema[] = [];
    
    // Find all CREATE TYPE public.*_enum AS ENUM statements
    const enumRegex = /CREATE TYPE public\.(\w+) AS ENUM \s*\(([\s\S]*?)\);/g;
    let match;

    while ((match = enumRegex.exec(schemaContent)) !== null) {
      const enumName = match[1];
      const enumBody = match[2];
      
      // Parse enum values
      const values = enumBody
        .split(',')
        .map(value => value.trim().replace(/^'|'$/g, ''))
        .filter(value => value);

      enums.push({
        name: enumName,
        values: values
      });
    }

    return enums.sort((a, b) => a.name.localeCompare(b.name));
  }

  private normalizeColumnType(type: string): string {
    // Map PostgreSQL types to more readable versions
    const typeMap: Record<string, string> = {
      'character varying': 'varchar',
      'character varying(100)': 'varchar(100)',
      'timestamp without time zone': 'timestamp',
      'numeric(10,2)': 'decimal(10,2)',
    };

    return typeMap[type] || type;
  }

  private extractDefault(rest: string): string | undefined {
    const defaultMatch = rest.match(/DEFAULT\s+([^,\s]+(?:\s*\([^)]*\))?)/);
    if (defaultMatch) {
      return defaultMatch[1].replace(/'/g, '');
    }
    return undefined;
  }

  private async getLiveTableData(tableName: string) {
    const supabase = this.supabaseService.getAdminClient();
    
    try {
      // Get row count
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      // Get sample data
      const { data, error: dataError } = await supabase
        .from(tableName)
        .select('*')
        .limit(3);

      return {
        rowCount: countError ? 0 : (count || 0),
        sampleData: dataError ? [] : (data || []),
        hasData: !countError && count && count > 0,
        error: countError || dataError
      };
    } catch (err) {
      return {
        rowCount: 0,
        sampleData: [],
        hasData: false,
        error: err
      };
    }
  }

  private generateHeader(): string {
    const now = new Date().toISOString();
    return `# Complete Database Schema Documentation

> **Generated on:** ${now}
> **Source:** Schema File + Live Supabase Database
> **Project:** Lo-que-pida E-commerce Platform

---

`;
  }

  private generateOverview(tables: TableSchema[], enums: EnumSchema[]): string {
    return `## Overview

This document contains the **complete database schema** for the **Lo-que-pida** e-commerce platform, combining schema definitions with live database statistics.

### Schema Statistics
- **Total Tables:** ${tables.length}
- **Total Enums:** ${enums.length}
- **Total Columns:** ${tables.reduce((sum, table) => sum + table.columns.length, 0)}
- **Database Type:** PostgreSQL (Supabase)

### Architecture
This is a comprehensive e-commerce platform supporting:
- **User Management** - Users, customers, sellers with role-based access
- **Product Catalog** - Categories, products, inventory management
- **Shopping Experience** - Carts, orders, order items
- **Payment Processing** - Multiple payment providers and statuses
- **Fulfillment** - Shipping, addresses, warehouses
- **Business Features** - Reviews, subscriptions, seller management

---

`;
  }

  private generateTableOfContents(tables: TableSchema[]): string {
    let toc = `## Table of Contents

### Database Tables
`;

    tables.forEach(table => {
      toc += `- [${table.name}](#${table.name.toLowerCase().replace(/_/g, '-')})\n`;
    });

    toc += '\n### Enums\n- [Database Enums](#database-enums)\n\n---\n\n';
    return toc;
  }

  private generateEnumsSection(enums: EnumSchema[]): string {
    let enumDoc = `## Database Enums

The database uses several enumerated types to enforce data integrity and provide predefined value sets:

`;

    enums.forEach(enumDef => {
      enumDoc += `### ${enumDef.name}
**Values:** \`${enumDef.values.join('` | `')}\`

`;
    });

    enumDoc += '---\n\n';
    return enumDoc;
  }

  private generateTableDocumentation(table: TableSchema, liveData: any): string {
    let doc = `## ${table.name}\n\n`;
    
    // Add table description based on name
    doc += this.getTableDescription(table.name);
    doc += `**Row Count:** ${liveData.rowCount.toLocaleString()} records\n`;
    doc += `**Status:** ${liveData.hasData ? '✅ Has Data' : '⚠️ Empty'}\n\n`;

    // Columns documentation
    doc += `### Columns\n\n`;
    doc += `| Column | Type | Nullable | Default | Notes |\n`;
    doc += `|--------|------|----------|---------|-------|\n`;

    table.columns.forEach(col => {
      const nullable = col.nullable ? '✅' : '❌';
      const defaultVal = col.default || '-';
      const notes = this.getColumnNotes(col);
      
      doc += `| \`${col.name}\` | ${col.type} | ${nullable} | \`${defaultVal}\` | ${notes} |\n`;
    });

    // Constraints
    if (table.constraints.length > 0) {
      doc += `\n### Constraints\n\n`;
      table.constraints.forEach(constraint => {
        doc += `- ${constraint}\n`;
      });
      doc += '\n';
    }

    // Sample data
    if (liveData.sampleData && liveData.sampleData.length > 0) {
      doc += `### Sample Data\n\n`;
      doc += '```json\n';
      doc += JSON.stringify(liveData.sampleData, null, 2);
      doc += '\n```\n\n';
    } else if (liveData.error) {
      doc += `### Sample Data\n\n`;
      doc += `*No sample data available: ${liveData.error.message}*\n\n`;
    }

    doc += '---\n\n';
    return doc;
  }

  private getTableDescription(tableName: string): string {
    const descriptions: Record<string, string> = {
      'users': 'Core user accounts with authentication and role management.\n',
      'customers': 'Customer profiles linked to user accounts.\n',
      'sellers': 'Seller/merchant profiles with store information.\n',
      'categories': 'Product categorization with hierarchical support.\n',
      'products': 'Product catalog with pricing and inventory links.\n',
      'inventory': 'Stock management and availability tracking.\n',
      'carts': 'Shopping cart sessions for customers.\n',
      'cart_items': 'Individual items within shopping carts.\n',
      'orders': 'Customer orders with status tracking.\n',
      'order_items': 'Line items within customer orders.\n',
      'payments': 'Payment processing and transaction records.\n',
      'addresses': 'Customer delivery and billing addresses.\n',
      'shipping_info': 'Shipping details and tracking information.\n',
      'subscriptions': 'Seller subscription plans and billing.\n',
      'product_reviews': 'Customer reviews and ratings for products.\n',
      'warehouse': 'Fulfillment centers and inventory locations.\n'
    };

    return descriptions[tableName] || 'Database table for the e-commerce platform.\n';
  }

  private getColumnNotes(col: ColumnSchema): string {
    const notes: string[] = [];
    
    if (col.isPrimary) {
      notes.push('🔑 Primary Key');
    }
    
    if (col.name.endsWith('_id') && col.name !== 'id') {
      notes.push('🔗 Foreign Key');
    }
    
    if (col.name === 'created_at' || col.name === 'updated_at') {
      notes.push('📅 Timestamp');
    }
    
    if (col.name === 'email') {
      notes.push('📧 Email');
    }
    
    if (col.type.includes('enum')) {
      notes.push('🏷️ Enum');
    }
    
    return notes.length > 0 ? notes.join(' ') : '-';
  }

  private generateFooter(): string {
    return `---

## Schema Analysis

### Key Relationships
- **Users** have roles (customer, seller, admin) and link to **customers** or **sellers**
- **Products** belong to **categories** and have **inventory** records
- **Orders** contain **order_items** and belong to **customers**
- **Carts** contain **cart_items** for shopping sessions
- **Sellers** have **subscriptions** and manage **warehouses**
- **Addresses** are used for both **customers** and **warehouses**

### Data Flow
1. **User Registration** → Creates **users** record
2. **Role Assignment** → Creates **customers** or **sellers** profile
3. **Product Management** → **Sellers** create **products** with **inventory**
4. **Shopping** → **Customers** add items to **carts**
5. **Checkout** → **Carts** become **orders** with **payments**
6. **Fulfillment** → **Orders** get **shipping_info** from **warehouses**

### Business Rules
- All tables use UUID primary keys for scalability
- Timestamps track creation and updates
- Enums enforce data integrity
- Foreign key relationships maintain referential integrity
- Soft deletes and status fields support business workflows

---

## Maintenance Notes

This documentation combines:
- **Schema structure** from database dump
- **Live data statistics** from Supabase queries
- **Business context** for understanding relationships

### How to Update
1. Export new schema: \`pg_dump --schema-only\`
2. Regenerate documentation
3. Review business logic changes
4. Update API endpoints as needed

---

*Generated by Lo-que-pida Enhanced Schema Generator*
`;
  }

  async saveSchemaToFile(documentation: string): Promise<void> {
    const filePath = path.join(process.cwd(), 'schema.md');
    
    try {
      fs.writeFileSync(filePath, documentation, 'utf8');
      console.log(`Complete schema documentation saved to: ${filePath}`);
    } catch (error) {
      throw new Error(`Failed to save schema file: ${error.message}`);
    }
  }
}
