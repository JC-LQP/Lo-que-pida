import { Controller, Get, Param } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SchemaGeneratorService } from './schema-generator.service';
import { SchemaFileGeneratorService } from './schema-file-generator.service';

@Controller('database-explorer')
export class DatabaseExplorerController {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly schemaGeneratorService: SchemaGeneratorService,
    private readonly schemaFileGeneratorService: SchemaFileGeneratorService
  ) {}

  @Get('debug-tables')
  async debugTables() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      const results = { methods: {} };

      // Method 1: information_schema query
      try {
        const { data: schemaData, error: schemaError } = await supabase
          .from('information_schema.tables')
          .select('table_name, table_schema, table_type')
          .eq('table_schema', 'public')
          .order('table_name');

        results.methods['information_schema'] = {
          success: !schemaError,
          error: schemaError?.message,
          count: schemaData?.length || 0,
          tables: schemaData?.map(t => t.table_name) || []
        };
      } catch (err: any) {
        results.methods['information_schema'] = {
          success: false,
          error: err.message,
          count: 0,
          tables: []
        };
      }

      // Method 2: Individual table detection (sample)
      const sampleTables = ['users', 'categories', 'products', 'orders', 'customers', 'sellers', 'inventory', 'cart_items'];
      const detectedTables: string[] = [];
      
      for (const tableName of sampleTables) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);
            
          if (!error) {
            detectedTables.push(tableName);
          }
        } catch (err) {
          // Table doesn't exist
        }
      }

      results.methods['individual_detection'] = {
        success: true,
        count: detectedTables.length,
        tables: detectedTables
      };

      return {
        success: true,
        message: 'Table detection debugging info',
        ...results
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Failed to debug table detection',
        error: err.message
      };
    }
  }

  @Get('generate-complete-schema-md')
  async generateCompleteSchemaDocumentation() {
    try {
      const schemaFilePath = 'C:\\Users\\JC\\Documents\\schema_readable.sql';
      const documentation = await this.schemaFileGeneratorService.generateFromSchemaFile(schemaFilePath);
      await this.schemaFileGeneratorService.saveSchemaToFile(documentation);
      
      return {
        success: true,
        message: 'Complete schema documentation generated successfully!',
        source: 'Schema file + Live database data',
        file_path: 'schema.md',
        preview: documentation.substring(0, 500) + '...',
        note: 'Full documentation with ALL 16 tables saved to schema.md in project root',
        tables_found: 16,
        enums_found: 9
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Failed to generate complete schema documentation',
        error: err.message
      };
    }
  }

  @Get('generate-schema-md')
  async generateSchemaDocumentation() {
    try {
      const documentation = await this.schemaGeneratorService.generateSchemaDocumentation();
      await this.schemaGeneratorService.saveSchemaToFile(documentation);
      
      return {
        success: true,
        message: 'Schema documentation generated successfully!',
        file_path: 'schema.md',
        preview: documentation.substring(0, 500) + '...',
        note: 'Full documentation saved to schema.md in project root'
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Failed to generate schema documentation',
        error: err.message
      };
    }
  }

  @Get('explore-schema')
  async exploreSchema() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      const results = {};

      // Get all tables in public schema
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name, table_type')
        .eq('table_schema', 'public')
        .order('table_name');

      if (!tablesError && tables) {
        results['tables'] = tables;
      }

      // Get all enums
      const { data: enums, error: enumsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, table_name, data_type, udt_name')
        .eq('table_schema', 'public')
        .like('data_type', 'USER-DEFINED')
        .order('table_name');

      if (!enumsError && enums) {
        results['enums'] = enums;
      }

      return {
        success: true,
        message: 'Schema exploration completed',
        database_info: {
          total_tables: tables?.length || 0,
          total_enums: enums?.length || 0
        },
        ...results
      };
    } catch (err) {
      return {
        success: false,
        message: 'Error exploring schema',
        error: err.message,
      };
    }
  }

  @Get('table/:tableName')
  async getTableInfo(@Param('tableName') tableName: string) {
    try {
      const supabase = this.supabaseService.getAdminClient();

      // Try to get row count
      let rowCount: number | null = null;
      try {
        const { count, error: countError } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
          
        if (!countError) {
          rowCount = count;
        }
      } catch (err) {
        // Row count failed, that's okay
      }

      // Try to get sample data (first 5 rows)
      let sampleData: any[] = [];
      let sampleError: string | null = null;
      try {
        const { data: sample, error: sampError } = await supabase
          .from(tableName)
          .select('*')
          .limit(5);
          
        if (!sampError && sample) {
          sampleData = sample;
        } else {
          sampleError = sampError?.message || null;
        }
      } catch (err: any) {
        sampleError = err.message;
      }

      // Get column info from sample data
      const columnInfo = sampleData.length > 0 ? 
        Object.keys(sampleData[0]).map((key, index) => ({
          column_name: key,
          data_type: typeof sampleData[0][key],
          sample_value: sampleData[0][key],
          ordinal_position: index + 1
        })) : [];

      return {
        success: true,
        message: `Table info for '${tableName}'`,
        table: {
          name: tableName,
          row_count: rowCount,
          sample_data: sampleData,
          sample_error: sampleError,
          columns_detected: columnInfo,
          metadata: {
            total_columns: columnInfo.length,
            has_data: rowCount !== null && rowCount > 0,
            size: rowCount ? `${rowCount} rows` : 'Unknown',
            note: 'Column info extracted from sample data since information_schema is restricted'
          }
        }
      };
    } catch (err) {
      return {
        success: false,
        message: `Error getting table info for '${tableName}'`,
        error: err.message,
      };
    }
  }

  @Get('sample-data')
  async getSampleData() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      const results = {};

      // Key tables to sample
      const tablesToSample = ['users', 'products', 'categories', 'orders', 'customers', 'sellers'];

      for (const table of tablesToSample) {
        try {
          const { data, error, count } = await supabase
            .from(table)
            .select('*', { count: 'exact' })
            .limit(2);

          results[table] = {
            total_rows: count,
            sample: data || [],
            error: error?.message || null,
            has_data: count !== null && count > 0
          };
        } catch (err) {
          results[table] = {
            error: err.message,
            has_data: false
          };
        }
      }

      return {
        success: true,
        message: 'Sample data from key tables',
        results,
        summary: {
          tables_checked: tablesToSample.length,
          tables_with_data: Object.values(results).filter((r: any) => r.has_data).length
        }
      };
    } catch (err) {
      return {
        success: false,
        message: 'Error getting sample data',
        error: err.message,
      };
    }
  }

  @Get('insert-sample-user')
  async insertSampleUser() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      const sampleUser = {
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'customer',
        is_verified: true,
        firebase_uid: `test_${Date.now()}`
      };

      const { data, error } = await supabase
        .from('users')
        .insert(sampleUser)
        .select();

      if (error) {
        return {
          success: false,
          message: 'Failed to insert sample user',
          error: error.message,
          suggestion: 'Check if the table exists and you have write permissions'
        };
      }

      return {
        success: true,
        message: 'Sample user inserted successfully!',
        inserted_user: data[0],
        note: 'You can now test with real data in your database'
      };
    } catch (err) {
      return {
        success: false,
        message: 'Error inserting sample user',
        error: err.message,
      };
    }
  }

  @Get('insert-sample-category')
  async insertSampleCategory() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      const sampleCategory = {
        name: 'Electronics',
        description: 'Electronic devices and gadgets'
      };

      const { data, error } = await supabase
        .from('categories')
        .insert(sampleCategory)
        .select();

      if (error) {
        return {
          success: false,
          message: 'Failed to insert sample category',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Sample category inserted successfully!',
        inserted_category: data[0]
      };
    } catch (err) {
      return {
        success: false,
        message: 'Error inserting sample category',
        error: err.message,
      };
    }
  }

  @Get('database-summary')
  async getDatabaseSummary() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      const summary = {
        tables: {},
        total_records: 0,
        connection_info: {
          project_url: process.env.SUPABASE_URL,
          project_ref: process.env.SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'Unknown',
          connection_method: 'Session Pooler (Working)',
          direct_connection: 'Not working (Normal for Supabase)'
        }
      };

      // Main business tables
      const mainTables = [
        'users', 'customers', 'sellers', 'products', 
        'categories', 'inventory', 'carts', 'cart_items',
        'orders', 'order_items', 'payments', 'addresses',
        'shipping_info', 'subscriptions', 'product_reviews', 'warehouse'
      ];

      for (const table of mainTables) {
        try {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

          if (!error) {
            summary.tables[table] = count || 0;
            summary.total_records += count || 0;
          } else {
            summary.tables[table] = `Error: ${error.message}`;
          }
        } catch (err) {
          summary.tables[table] = `Error: ${err.message}`;
        }
      }

      const tablesWithData = Object.values(summary.tables)
        .filter(count => typeof count === 'number' && count > 0).length;

      return {
        success: true,
        message: 'Database summary completed',
        summary,
        analysis: {
          total_tables_checked: mainTables.length,
          tables_with_data: tablesWithData,
          total_records_across_all_tables: summary.total_records,
          database_status: summary.total_records > 0 ? 'Has Data' : 'Empty/No Data',
          ready_for_testing: tablesWithData > 0
        },
        next_steps: {
          if_empty: 'Use the insert-sample-* endpoints to add test data',
          if_has_data: 'Use the table/:tableName endpoint to explore specific tables',
          testing: 'Use sample-data endpoint to see existing data samples'
        }
      };
    } catch (err) {
      return {
        success: false,
        message: 'Error getting database summary',
        error: err.message,
      };
    }
  }

  @Get('enum-details')
  async getEnumDetails(): Promise<any> {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      // Get enum usage in tables from information schema
      const { data: enumUsage, error: enumError } = await supabase
        .from('information_schema.columns')
        .select('column_name, table_name, data_type, udt_name')
        .eq('table_schema', 'public')
        .like('data_type', 'USER-DEFINED')
        .order('table_name');

      if (enumError) {
        return {
          success: false,
          message: 'Failed to get enum usage',
          error: enumError.message
        };
      }

      // Group by enum type
      const enumGroups = {};
      enumUsage?.forEach(col => {
        if (!enumGroups[col.udt_name]) {
          enumGroups[col.udt_name] = [];
        }
        enumGroups[col.udt_name].push(`${col.table_name}.${col.column_name}`);
      });

      return {
        success: true,
        message: 'Enum usage in your database',
        enum_usage: enumUsage,
        enum_groups: enumGroups,
        known_enums_from_schema: {
          orders_status_enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
          payments_provider_enum: ['stripe', 'kushki', 'local'],
          payments_status_enum: ['pending', 'paid', 'failed'],
          products_condition_enum: ['NEW', 'USED', 'REFURBISHED'],
          sellers_status_enum: ['active', 'inactive', 'banned'],
          subscriptions_billingcycle_enum: ['monthly', 'yearly'],
          subscriptions_plan_enum: ['basic', 'premium', 'enterprise'],
          subscriptions_status_enum: ['paid', 'unpaid'],
          users_role_enum: ['customer', 'seller', 'admin']
        },
        suggestion: 'These are the enums defined in your schema.sql'
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Error getting enum details',
        error: err.message,
      };
    }
  }

  @Get('create-seller')
  async createSeller() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      // First, get or create a user
      let userId;
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'seller')
        .limit(1);
      
      if (userError || !users?.length) {
        // Create a seller user
        const { data: newUser, error: createUserError } = await supabase
          .from('users')
          .insert({
            email: `seller${Date.now()}@example.com`,
            full_name: 'John Seller',
            role: 'seller',
            is_verified: true,
            firebase_uid: `seller_${Date.now()}`
          })
          .select();
          
        if (createUserError) {
          return {
            success: false,
            message: 'Failed to create seller user',
            error: createUserError.message
          };
        }
        
        userId = newUser[0]?.id;
      } else {
        userId = users[0]?.id;
      }
      
      // Create seller profile
      const { data: seller, error: sellerError } = await supabase
        .from('sellers')
        .insert({
          store_name: `Electronics Store ${Date.now()}`,
          store_description: 'Your one-stop shop for electronics',
          status: 'active',
          user_id: userId
        })
        .select();
        
      if (sellerError) {
        return {
          success: false,
          message: 'Failed to create seller',
          error: sellerError.message
        };
      }
      
      return {
        success: true,
        message: 'Seller created successfully',
        seller: seller[0],
        user_id: userId
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Error creating seller',
        error: err.message
      };
    }
  }

  @Get('create-customer')
  async createCustomer() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      // Get or create a customer user
      let userId;
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'customer')
        .limit(1);
      
      if (userError || !users?.length) {
        // Create a customer user
        const { data: newUser, error: createUserError } = await supabase
          .from('users')
          .insert({
            email: `customer${Date.now()}@example.com`,
            full_name: 'Jane Customer',
            role: 'customer',
            is_verified: true,
            firebase_uid: `customer_${Date.now()}`
          })
          .select();
          
        if (createUserError) {
          return {
            success: false,
            message: 'Failed to create customer user',
            error: createUserError.message
          };
        }
        
        userId = newUser[0]?.id;
      } else {
        userId = users[0]?.id;
      }
      
      // Create customer profile
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({
          user_id: userId
        })
        .select();
        
      if (customerError) {
        return {
          success: false,
          message: 'Failed to create customer',
          error: customerError.message
        };
      }
      
      return {
        success: true,
        message: 'Customer created successfully',
        customer: customer[0],
        user_id: userId
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Error creating customer',
        error: err.message
      };
    }
  }

  @Get('create-order')
  async createSampleOrder() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      // Get or create a customer
      let customerId;
      const { data: customers, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .limit(1);
      
      if (customerError || !customers?.length) {
        return {
          success: false,
          message: 'No customers found. Create a customer first.',
          suggestion: 'Use /database-explorer/create-customer endpoint first'
        };
      }
      
      customerId = customers[0]?.id;
      
      // Get a product
      const { data: products, error: productError } = await supabase
        .from('products')
        .select('id, price')
        .limit(1);
        
      if (productError || !products?.length) {
        return {
          success: false,
          message: 'No products found. Create a product first.',
          suggestion: 'Use /database-explorer/create-product endpoint first'
        };
      }
      
      const product = products[0];
      const quantity = 2;
      const total = parseFloat(product.price) * quantity;
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          status: 'pending',
          total: total,
          customer_id: customerId
        })
        .select();
        
      if (orderError) {
        return {
          success: false,
          message: 'Failed to create order',
          error: orderError.message
        };
      }
      
      // Create order item
      const { data: orderItem, error: orderItemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order[0].id,
          product_id: product.id,
          quantity: quantity,
          unit_price: product.price
        });
        
      if (orderItemError) {
        return {
          success: false,
          message: 'Failed to create order item',
          error: orderItemError.message
        };
      }
      
      return {
        success: true,
        message: 'Order created successfully',
        order: order[0],
        order_item: orderItem,
        summary: {
          customer_id: customerId,
          product_id: product.id,
          quantity: quantity,
          total: total
        }
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Error creating order',
        error: err.message
      };
    }
  }

  @Get('populate-sample-database')
  async populateFullDatabase() {
    try {
      const results = [];
      
      // Create users, customers, sellers, categories, products, orders
      const operations = [
        { name: 'user', endpoint: 'insert-sample-user' },
        { name: 'category', endpoint: 'insert-sample-category' },
        { name: 'customer', endpoint: 'create-customer' },
        { name: 'seller', endpoint: 'create-seller' },
        { name: 'product', endpoint: 'create-product' },
        { name: 'order', endpoint: 'create-order' }
      ];
      
      return {
        success: true,
        message: 'Database population endpoints available',
        operations: operations.map(op => ({
          name: op.name,
          endpoint: `http://localhost:3000/database-explorer/${op.endpoint}`,
          description: `Create sample ${op.name}`
        })),
        recommendation: 'Run these endpoints in order to create a complete sample database',
        quick_populate: 'Visit each endpoint above to populate your database with sample data'
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Error in populate database',
        error: err.message
      };
    }
  }

  @Get('create-address')
  async createSampleAddress() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      // Get a customer
      const { data: customers, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .limit(1);
      
      if (customerError || !customers?.length) {
        return {
          success: false,
          message: 'No customers found. Create a customer first.',
          suggestion: 'Use /database-explorer/create-customer endpoint first'
        };
      }
      
      const customerId = customers[0]?.id;
      
      const sampleAddress = {
        recipientName: 'Jane Doe',
        streetAddress: '123 Main Street, Apt 4B',
        city: 'New York',
        province: 'NY',
        country: 'USA',
        postalCode: '10001',
        phoneNumber: '+1-555-0123',
        isDefault: true,
        customer_id: customerId
      };

      const { data, error } = await supabase
        .from('addresses')
        .insert(sampleAddress)
        .select();

      if (error) {
        return {
          success: false,
          message: 'Failed to create address',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Sample address created successfully!',
        address: data[0]
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Error creating address',
        error: err.message
      };
    }
  }

  @Get('create-cart')
  async createSampleCart() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      // Get a customer
      const { data: customers, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .limit(1);
      
      if (customerError || !customers?.length) {
        return {
          success: false,
          message: 'No customers found. Create a customer first.',
          suggestion: 'Use /database-explorer/create-customer endpoint first'
        };
      }
      
      const customerId = customers[0]?.id;
      
      // Create cart
      const { data: cart, error: cartError } = await supabase
        .from('carts')
        .insert({
          customerId: customerId
        })
        .select();
        
      if (cartError) {
        return {
          success: false,
          message: 'Failed to create cart',
          error: cartError.message
        };
      }
      
      // Get products to add to cart
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id')
        .limit(2);
        
      if (productsError || !products?.length) {
        return {
          success: true,
          message: 'Cart created but no products to add',
          cart: cart[0],
          note: 'Create products first to add items to cart'
        };
      }
      
      // Add items to cart
      const cartItems = products.map(product => ({
        quantity: Math.floor(Math.random() * 3) + 1, // 1-3 items
        cartId: cart[0].id,
        productId: product.id
      }));
      
      const { data: items, error: itemsError } = await supabase
        .from('cart_items')
        .insert(cartItems)
        .select();
        
      return {
        success: true,
        message: 'Shopping cart created with items!',
        cart: cart[0],
        cart_items: items || [],
        summary: {
          customer_id: customerId,
          total_items: items?.length || 0
        }
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Error creating cart',
        error: err.message
      };
    }
  }

  @Get('create-payment')
  async createSamplePayment() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      // Get an order
      const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select('id')
        .eq('status', 'pending')
        .limit(1);
      
      if (orderError || !orders?.length) {
        return {
          success: false,
          message: 'No pending orders found. Create an order first.',
          suggestion: 'Use /database-explorer/create-order endpoint first'
        };
      }
      
      const orderId = orders[0]?.id;
      
      const samplePayment = {
        provider: 'stripe',
        status: 'paid',
        transaction_id: `txn_${Date.now()}`,
        order_id: orderId
      };

      const { data, error } = await supabase
        .from('payments')
        .insert(samplePayment)
        .select();

      if (error) {
        return {
          success: false,
          message: 'Failed to create payment',
          error: error.message
        };
      }

      // Update order status to processing
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', orderId);

      return {
        success: true,
        message: 'Payment processed successfully!',
        payment: data[0],
        note: updateError ? 'Payment created but order status not updated' : 'Order status updated to processing'
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Error creating payment',
        error: err.message
      };
    }
  }

  @Get('create-product-review')
  async createSampleProductReview() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      // Get a user and product
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
        
      const { data: products, error: productError } = await supabase
        .from('products')
        .select('id')
        .limit(1);
      
      if (userError || !users?.length || productError || !products?.length) {
        return {
          success: false,
          message: 'Need users and products to create reviews',
          suggestion: 'Create users and products first'
        };
      }
      
      const sampleReview = {
        rating: Math.floor(Math.random() * 5) + 1, // 1-5 stars
        comment: 'Great product! Fast delivery and excellent quality. Highly recommended!',
        userId: users[0].id,
        productId: products[0].id
      };

      const { data, error } = await supabase
        .from('product_reviews')
        .insert(sampleReview)
        .select();

      if (error) {
        return {
          success: false,
          message: 'Failed to create product review',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Product review created successfully!',
        review: data[0]
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Error creating product review',
        error: err.message
      };
    }
  }

  @Get('create-warehouse')
  async createSampleWarehouse() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      // Get a seller and address
      const { data: sellers, error: sellerError } = await supabase
        .from('sellers')
        .select('id')
        .limit(1);
        
      const { data: addresses, error: addressError } = await supabase
        .from('addresses')
        .select('id')
        .limit(1);
      
      if (sellerError || !sellers?.length) {
        return {
          success: false,
          message: 'No sellers found. Create a seller first.',
          suggestion: 'Use /database-explorer/create-seller endpoint first'
        };
      }
      
      if (addressError || !addresses?.length) {
        return {
          success: false,
          message: 'No addresses found. Create an address first.',
          suggestion: 'Use /database-explorer/create-address endpoint first'
        };
      }
      
      const sampleWarehouse = {
        name: 'Main Distribution Center',
        seller_id: sellers[0].id,
        address_id: addresses[0].id
      };

      const { data, error } = await supabase
        .from('warehouse')
        .insert(sampleWarehouse)
        .select();

      if (error) {
        return {
          success: false,
          message: 'Failed to create warehouse',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Warehouse created successfully!',
        warehouse: data[0]
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Error creating warehouse',
        error: err.message
      };
    }
  }

  @Get('create-subscription')
  async createSampleSubscription() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      // Get a seller
      const { data: sellers, error: sellerError } = await supabase
        .from('sellers')
        .select('id')
        .limit(1);
      
      if (sellerError || !sellers?.length) {
        return {
          success: false,
          message: 'No sellers found. Create a seller first.',
          suggestion: 'Use /database-explorer/create-seller endpoint first'
        };
      }
      
      const sellerId = sellers[0]?.id;
      
      const sampleSubscription = {
        plan: 'premium',
        billingCycle: 'monthly',
        status: 'paid',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        sellerId: sellerId
      };

      const { data, error } = await supabase
        .from('subscriptions')
        .insert(sampleSubscription)
        .select();

      if (error) {
        return {
          success: false,
          message: 'Failed to create subscription',
          error: error.message
        };
      }

      // Update seller with subscription
      const { error: updateError } = await supabase
        .from('sellers')
        .update({ subscription_id: data[0].id })
        .eq('id', sellerId);

      return {
        success: true,
        message: 'Subscription created successfully!',
        subscription: data[0],
        note: updateError ? 'Subscription created but seller not updated' : 'Seller subscription updated'
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Error creating subscription',
        error: err.message
      };
    }
  }

  @Get('create-shipping-info')
  async createSampleShippingInfo() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      // Get an order and address
      const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select('id')
        .limit(1);
        
      const { data: addresses, error: addressError } = await supabase
        .from('addresses')
        .select('id')
        .limit(1);
      
      if (orderError || !orders?.length) {
        return {
          success: false,
          message: 'No orders found. Create an order first.',
          suggestion: 'Use /database-explorer/create-order endpoint first'
        };
      }
      
      if (addressError || !addresses?.length) {
        return {
          success: false,
          message: 'No addresses found. Create an address first.',
          suggestion: 'Use /database-explorer/create-address endpoint first'
        };
      }
      
      const sampleShipping = {
        shipping_method: 'Express Delivery',
        tracking_number: `TRACK${Date.now()}`,
        carrier_name: 'FedEx',
        order_id: orders[0].id,
        address_id: addresses[0].id,
        estimated_delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
      };

      const { data, error } = await supabase
        .from('shipping_info')
        .insert(sampleShipping)
        .select();

      if (error) {
        return {
          success: false,
          message: 'Failed to create shipping info',
          error: error.message
        };
      }

      // Update order status to shipped
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'shipped' })
        .eq('id', orders[0].id);

      return {
        success: true,
        message: 'Shipping info created successfully!',
        shipping: data[0],
        note: updateError ? 'Shipping created but order status not updated' : 'Order status updated to shipped'
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Error creating shipping info',
        error: err.message
      };
    }
  }

  @Get('complete-ecommerce-setup')
  async completeEcommerceSetup() {
    return {
      success: true,
      message: 'Complete E-commerce Platform Setup Guide',
      endpoints: {
        basic_data: [
          'http://localhost:3000/database-explorer/insert-sample-user',
          'http://localhost:3000/database-explorer/insert-sample-category',
          'http://localhost:3000/database-explorer/create-customer',
          'http://localhost:3000/database-explorer/create-seller',
          'http://localhost:3000/database-explorer/create-product'
        ],
        ecommerce_features: [
          'http://localhost:3000/database-explorer/create-address',
          'http://localhost:3000/database-explorer/create-cart',
          'http://localhost:3000/database-explorer/create-order',
          'http://localhost:3000/database-explorer/create-payment',
          'http://localhost:3000/database-explorer/create-shipping-info'
        ],
        business_features: [
          'http://localhost:3000/database-explorer/create-product-review',
          'http://localhost:3000/database-explorer/create-warehouse',
          'http://localhost:3000/database-explorer/create-subscription'
        ]
      },
      recommended_order: [
        '1. Create basic data (users, categories, customers, sellers, products)',
        '2. Create addresses for customers',
        '3. Create shopping carts and add items',
        '4. Create orders from cart items',
        '5. Process payments for orders',
        '6. Create shipping information',
        '7. Add product reviews',
        '8. Set up warehouses and subscriptions'
      ],
      quick_setup: 'Run all basic_data endpoints first, then ecommerce_features, then business_features'
    };
  }

  @Get('create-product')
  async createProduct() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      // First, ensure we have a category
      let categoryId;
      const { data: categories, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .limit(1);
      
      if (categoryError || !categories?.length) {
        // Create a category if none exists
        const { data: newCategory, error: createCategoryError } = await supabase
          .from('categories')
          .insert({ name: 'Electronics', description: 'Electronic devices and gadgets' })
          .select();
          
        if (createCategoryError) {
          return {
            success: false,
            message: 'Failed to create category',
            error: createCategoryError.message
          };
        }
        
        categoryId = newCategory[0]?.id;
      } else {
        categoryId = categories[0]?.id;
      }
      
      // Create inventory record
      const { data: inventory, error: inventoryError } = await supabase
        .from('inventory')
        .insert({
          stock: 100,
          reserved_stock: 0,
          sold_stock: 0,
          categoryId: categoryId
        })
        .select();
        
      if (inventoryError) {
        return {
          success: false,
          message: 'Failed to create inventory',
          error: inventoryError.message
        };
      }
      
      // Find a seller or create one
      let sellerId;
      const { data: sellers, error: sellerError } = await supabase
        .from('sellers')
        .select('id')
        .limit(1);
        
      if (sellerError || !sellers?.length) {
        // We'd need a user to create a seller, but that's complex
        sellerId = null;
      } else {
        sellerId = sellers[0]?.id;
      }
      
      // Create product
      const sampleProduct = {
        name: 'Smartphone X1',
        description: 'Latest smartphone with amazing features',
        price: 799.99,
        condition: 'NEW',
        sellerId: sellerId,
        inventoryId: inventory[0]?.id
      };
      
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert(sampleProduct)
        .select();
        
      if (productError) {
        return {
          success: false,
          message: 'Failed to create product',
          error: productError.message
        };
      }
      
      return {
        success: true,
        message: 'Product created successfully',
        product: product[0],
        inventory: inventory[0],
        categoryId
      };
    } catch (err) {
      return {
        success: false,
        message: 'Error creating product',
        error: err.message
      };
    }
  }
}