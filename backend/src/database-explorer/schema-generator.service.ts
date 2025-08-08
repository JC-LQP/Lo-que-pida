import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import * as fs from 'fs';
import * as path from 'path';

interface TableInfo {
  table_name: string;
  table_schema: string;
  table_type: string;
}

interface ColumnInfo {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
  numeric_precision: number | null;
  numeric_scale: number | null;
}

interface ConstraintInfo {
  table_name: string;
  constraint_name: string;
  constraint_type: string;
  column_name: string;
  foreign_table_name: string | null;
  foreign_column_name: string | null;
}

@Injectable()
export class SchemaGeneratorService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async generateSchemaDocumentation(): Promise<string> {
    const supabase = this.supabaseService.getAdminClient();
    let documentation = '';

    try {
      // Get all tables
      const tables = await this.getTables();
      const columns = await this.getColumns();
      const constraints = await this.getConstraints();

      documentation += this.generateHeader();
      documentation += await this.generateOverview(tables);
      documentation += this.generateTableOfContents(tables);
      
      // Generate detailed documentation for each table
      for (const table of tables) {
        if (table.table_schema === 'public') { // Focus on public schema
          const tableColumns = columns.filter(col => col.table_name === table.table_name);
          const tableConstraints = constraints.filter(cons => cons.table_name === table.table_name);
          const sampleData = await this.getSampleData(table.table_name);
          const rowCount = await this.getRowCount(table.table_name);

          documentation += this.generateTableDocumentation(
            table,
            tableColumns,
            tableConstraints,
            sampleData,
            rowCount
          );
        }
      }

      documentation += this.generateFooter();
      return documentation;

    } catch (error) {
      console.error('Error generating schema documentation:', error);
      throw new Error(`Failed to generate schema documentation: ${error.message}`);
    }
  }

  private async getTables(): Promise<TableInfo[]> {
    const supabase = this.supabaseService.getAdminClient();
    
    // Try multiple approaches to get all tables
    
    // Method 1: Try direct information_schema query
    try {
      const { data: schemaData, error: schemaError } = await supabase
        .from('information_schema.tables')
        .select('table_name, table_schema, table_type')
        .eq('table_schema', 'public')
        .order('table_name');

      if (!schemaError && schemaData && schemaData.length > 0) {
        console.log(`Found ${schemaData.length} tables via information_schema`);
        return schemaData;
      }
    } catch (err) {
      console.warn('information_schema query failed:', err);
    }

    // Method 2: Try querying each known table individually
    console.log('Falling back to individual table detection...');
    const potentialTables = [
      // Core user management
      'users', 'customers', 'sellers', 'user_profiles', 'user_sessions',
      
      // Product catalog
      'categories', 'products', 'product_categories', 'product_images',
      'product_variants', 'product_attributes', 'brands', 'inventory',
      
      // Shopping & Orders
      'shopping_carts', 'carts', 'cart_items', 'orders', 'order_items',
      'order_status_history', 'wishlists', 'wishlist_items',
      
      // Payments & Finance
      'payments', 'payment_methods', 'transactions', 'refunds',
      'billing_addresses', 'invoices', 'tax_rates', 'discounts', 'coupons',
      
      // Shipping & Delivery
      'addresses', 'shipping_addresses', 'shipping_info', 'shipping_methods',
      'shipping_rates', 'delivery_slots', 'tracking_info',
      
      // Reviews & Feedback
      'reviews', 'product_reviews', 'seller_reviews', 'ratings',
      'review_images', 'review_replies',
      
      // Business & Seller Management
      'subscriptions', 'seller_subscriptions', 'seller_plans',
      'warehouse', 'warehouses', 'seller_profiles', 'seller_documents',
      'seller_categories', 'seller_settings',
      
      // Analytics & Reporting
      'analytics_events', 'page_views', 'product_views', 'search_queries',
      'conversion_events', 'sales_reports', 'inventory_reports',
      
      // Communication & Support
      'notifications', 'messages', 'support_tickets', 'chat_sessions',
      'email_templates', 'sms_templates', 'push_notifications',
      
      // Marketing & Promotions
      'campaigns', 'promotion_codes', 'affiliate_links', 'referrals',
      'loyalty_points', 'reward_programs', 'newsletter_subscriptions',
      
      // System & Admin
      'audit_logs', 'system_settings', 'feature_flags', 'api_keys',
      'webhooks', 'scheduled_jobs', 'error_logs', 'performance_logs',
      
      // Returns & Exchanges
      'returns', 'return_items', 'exchanges', 'return_reasons',
      'return_policies', 'warranty_claims'
    ];

    const existingTables: TableInfo[] = [];
    
    for (const tableName of potentialTables) {
      try {
        // Try to query the table to see if it exists
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
          
        if (!error) {
          existingTables.push({
            table_name: tableName,
            table_schema: 'public',
            table_type: 'BASE TABLE'
          });
          console.log(`✓ Found table: ${tableName}`);
        }
      } catch (err) {
        // Table doesn't exist or no permissions
      }
    }

    if (existingTables.length > 0) {
      console.log(`Found ${existingTables.length} tables via individual detection`);
      return existingTables;
    }

    // Method 3: Use default list as last resort
    console.warn('Using default table list as fallback');
    return this.getDefaultTables();
  }

  private async getColumns(): Promise<ColumnInfo[]> {
    const supabase = this.supabaseService.getAdminClient();
    
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select(`
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale
      `)
      .in('table_schema', ['public', 'auth'])
      .order('table_name, ordinal_position');

    if (error) {
      console.warn('Could not fetch columns:', error);
      return [];
    }

    return data || [];
  }

  private async getConstraints(): Promise<ConstraintInfo[]> {
    const supabase = this.supabaseService.getAdminClient();
    
    // This is a complex query, so we'll build it step by step
    const query = `
      SELECT 
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      LEFT JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_name = ccu.constraint_name
        AND tc.table_schema = ccu.table_schema
      WHERE tc.table_schema IN ('public', 'auth')
      ORDER BY tc.table_name, tc.constraint_name;
    `;

    try {
      const { data, error } = await supabase.rpc('execute_sql', { query });
      if (error) {
        console.warn('Could not fetch constraints:', error);
        return [];
      }
      return data || [];
    } catch {
      return [];
    }
  }

  private async getSampleData(tableName: string): Promise<any[]> {
    const supabase = this.supabaseService.getAdminClient();
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(3);

      if (error) {
        return [];
      }
      return data || [];
    } catch {
      return [];
    }
  }

  private async getRowCount(tableName: string): Promise<number> {
    const supabase = this.supabaseService.getAdminClient();
    
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (error) {
        return 0;
      }
      return count || 0;
    } catch {
      return 0;
    }
  }

  private getDefaultTables(): TableInfo[] {
    // Fallback list based on typical e-commerce schema
    return [
      { table_name: 'users', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'categories', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'products', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'orders', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'order_items', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'payments', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'addresses', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'shopping_carts', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'reviews', table_schema: 'public', table_type: 'BASE TABLE' },
      { table_name: 'subscriptions', table_schema: 'public', table_type: 'BASE TABLE' },
    ];
  }

  private generateHeader(): string {
    const now = new Date().toISOString();
    return `# Database Schema Documentation

> **Generated on:** ${now}
> **Source:** Live Supabase Database
> **Project:** Lo-que-pida Backend

---

`;
  }

  private async generateOverview(tables: TableInfo[]): Promise<string> {
    const publicTables = tables.filter(t => t.table_schema === 'public');
    const authTables = tables.filter(t => t.table_schema === 'auth');
    
    return `## Overview

This document contains the complete database schema for the **Lo-que-pida** e-commerce platform.

### Statistics
- **Public Tables:** ${publicTables.length}
- **Authentication Tables:** ${authTables.length}
- **Total Tables:** ${tables.length}
- **Database Type:** PostgreSQL (Supabase)

### Schema Organization
- \`public\` - Main application tables
- \`auth\` - Supabase authentication system tables

---

`;
  }

  private generateTableOfContents(tables: TableInfo[]): string {
    let toc = `## Table of Contents

### Public Schema Tables
`;

    const publicTables = tables.filter(t => t.table_schema === 'public');
    publicTables.forEach(table => {
      toc += `- [${table.table_name}](#${table.table_name.toLowerCase().replace(/_/g, '-')})\n`;
    });

    toc += '\n---\n\n';
    return toc;
  }

  private generateTableDocumentation(
    table: TableInfo,
    columns: ColumnInfo[],
    constraints: ConstraintInfo[],
    sampleData: any[],
    rowCount: number
  ): string {
    let doc = `## ${table.table_name}\n\n`;
    doc += `**Type:** ${table.table_type}\n`;
    doc += `**Schema:** ${table.table_schema}\n`;
    doc += `**Row Count:** ${rowCount.toLocaleString()}\n\n`;

    // Columns documentation
    doc += `### Columns\n\n`;
    doc += `| Column | Type | Nullable | Default | Notes |\n`;
    doc += `|--------|------|----------|---------|-------|\n`;

    columns.forEach(col => {
      const type = this.formatDataType(col);
      const nullable = col.is_nullable === 'YES' ? '✅' : '❌';
      const defaultVal = col.column_default || '-';
      const notes = this.getColumnNotes(col, constraints);
      
      doc += `| \`${col.column_name}\` | ${type} | ${nullable} | \`${defaultVal}\` | ${notes} |\n`;
    });

    // Constraints
    const tableConstraints = constraints.filter(c => c.table_name === table.table_name);
    if (tableConstraints.length > 0) {
      doc += `\n### Constraints\n\n`;
      
      const primaryKeys = tableConstraints.filter(c => c.constraint_type === 'PRIMARY KEY');
      const foreignKeys = tableConstraints.filter(c => c.constraint_type === 'FOREIGN KEY');
      const uniqueKeys = tableConstraints.filter(c => c.constraint_type === 'UNIQUE');
      
      if (primaryKeys.length > 0) {
        doc += `**Primary Key:** \`${primaryKeys.map(pk => pk.column_name).join(', ')}\`\n\n`;
      }
      
      if (foreignKeys.length > 0) {
        doc += `**Foreign Keys:**\n`;
        foreignKeys.forEach(fk => {
          doc += `- \`${fk.column_name}\` → \`${fk.foreign_table_name}.${fk.foreign_column_name}\`\n`;
        });
        doc += '\n';
      }
      
      if (uniqueKeys.length > 0) {
        doc += `**Unique Constraints:**\n`;
        uniqueKeys.forEach(uk => {
          doc += `- \`${uk.column_name}\`\n`;
        });
        doc += '\n';
      }
    }

    // Sample data
    if (sampleData.length > 0) {
      doc += `### Sample Data\n\n`;
      doc += '```json\n';
      doc += JSON.stringify(sampleData, null, 2);
      doc += '\n```\n\n';
    }

    doc += '---\n\n';
    return doc;
  }

  private formatDataType(col: ColumnInfo): string {
    let type = col.data_type;
    
    if (col.character_maximum_length) {
      type += `(${col.character_maximum_length})`;
    } else if (col.numeric_precision && col.numeric_scale !== null) {
      type += `(${col.numeric_precision},${col.numeric_scale})`;
    } else if (col.numeric_precision) {
      type += `(${col.numeric_precision})`;
    }
    
    return type;
  }

  private getColumnNotes(col: ColumnInfo, constraints: ConstraintInfo[]): string {
    const notes: string[] = [];
    
    const colConstraints = constraints.filter(c => c.column_name === col.column_name);
    
    if (colConstraints.some(c => c.constraint_type === 'PRIMARY KEY')) {
      notes.push('🔑 Primary Key');
    }
    
    if (colConstraints.some(c => c.constraint_type === 'FOREIGN KEY')) {
      notes.push('🔗 Foreign Key');
    }
    
    if (colConstraints.some(c => c.constraint_type === 'UNIQUE')) {
      notes.push('✨ Unique');
    }
    
    if (col.column_name === 'created_at' || col.column_name === 'updated_at') {
      notes.push('📅 Timestamp');
    }
    
    return notes.length > 0 ? notes.join(' ') : '-';
  }

  private generateFooter(): string {
    return `---

## Notes

This documentation was automatically generated from the live Supabase database. 

### How to Update
To regenerate this documentation:
1. Run your backend server
2. Call the endpoint: \`GET /database-explorer/generate-schema-md\`
3. The schema.md file will be updated automatically

### Maintenance
- Regenerate after schema changes
- Update descriptions and business logic manually
- Keep sample data current

---

*Generated by Lo-que-pida Backend Schema Generator*
`;
  }

  async saveSchemaToFile(documentation: string): Promise<void> {
    const filePath = path.join(process.cwd(), 'schema.md');
    
    try {
      fs.writeFileSync(filePath, documentation, 'utf8');
      console.log(`Schema documentation saved to: ${filePath}`);
    } catch (error) {
      throw new Error(`Failed to save schema file: ${error.message}`);
    }
  }
}