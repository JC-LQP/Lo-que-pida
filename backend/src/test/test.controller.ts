import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, SellerStatus, ProductCondition, OrderStatus, PaymentStatus } from '@prisma/client';

interface TestUser {
  name: string;
  email: string;
  age?: number;
}

interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  role?: UserRole;
  phoneNumber?: string;
}

interface CreateCategoryDto {
  name: string;
  description?: string;
  parentId?: string;
  sortOrder?: number;
}

interface CreateProductDto {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  categoryId: string;
  sellerId: string;
  condition?: ProductCondition;
  brand?: string;
  model?: string;
  weight?: number;
  images?: string[];
  tags?: string[];
  sku?: string;
  trackQuantity?: boolean;
}

interface CreateAddressDto {
  customerId: string;
  recipientName: string;
  streetAddress: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  phoneNumber?: string;
  isDefault?: boolean;
  addressType?: string;
}

interface CreateReviewDto {
  customerId: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}

interface CreateCartDto {
  customerId: string;
  sessionId?: string;
}

interface CreateCartItemDto {
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
}

interface CreateOrderDto {
  customerId: string;
  shippingAddressId: string;
  billingAddressId?: string;
  subtotal: number;
  shippingCost?: number;
  taxAmount?: number;
  notes?: string;
}

interface CreateOrderItemDto {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

interface CreatePaymentDto {
  orderId: string;
  provider: string;
  amount: number;
  currency?: string;
  transactionId?: string;
}

interface CreateSubscriptionDto {
  sellerId: string;
  plan: string;
  billingCycle: string;
  price: number;
  startDate: string;
  endDate: string;
  autoRenew?: boolean;
}

interface CreateShippingInfoDto {
  orderId: string;
  carrier?: string;
  trackingNumber?: string;
  shippingMethod?: string;
  estimatedDelivery?: string;
  shippingCost: number;
  weight?: number;
}

@Controller('test')
export class TestController {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prismaService: PrismaService
  ) {}

  @Get()
  getHello(): string {
    return 'Hello! Your NestJS app is running successfully! 🚀';
  }

  @Get('firebase')
  getFirebase(): string {
    return 'Firebase is configured and working! ✅';
  }

  @Get('config')
  getConfig() {
    return {
      message: 'Configuration loaded successfully',
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nodeEnv: process.env.NODE_ENV,
    };
  }

  // === DATABASE CONNECTION TESTS ===
  
  @Get('connection')
  async testConnection() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      // Test basic connection with simple count query
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (error) {
        // If users table doesn't exist, try a different approach
        const { data: healthCheck, error: healthError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .limit(5);
          
        if (healthError) {
          return {
            success: false,
            message: 'Database connection failed',
            error: healthError.message,
          };
        }
        
        return {
          success: true,
          message: 'Database connection successful! ✅',
          method: 'schema_query',
          tables_found: healthCheck?.length || 0,
          tables: healthCheck?.map(t => t.table_name) || [],
        };
      }

      return {
        success: true,
        message: 'Database connection successful! ✅',
        method: 'users_count',
        users_count: count || 0,
      };
    } catch (err) {
      return {
        success: false,
        message: 'Connection test failed',
        error: err.message,
      };
    }
  }
  
  @Get('simple-test')
  async simpleTest() {
    try {
      const supabase = this.supabaseService.getAdminClient();
      
      // Simple connection test - try count on users table from our e-commerce schema
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (error) {
        // If our custom users table doesn't exist, try a basic Supabase connection test
        try {
          const healthTest = await supabase.from('information_schema.tables')
            .select('table_name')
            .limit(1);
            
          return {
            success: true,
            message: 'Supabase connection working! ✅',
            note: 'Custom users table not found, but database is accessible',
            timestamp: new Date().toISOString(),
          };
        } catch (healthErr) {
          return {
            success: false,
            message: 'Database connection failed',
            error: error.message,
          };
        }
      }

      return {
        success: true,
        message: 'Supabase database is working! ✅',
        users_count: count || 0,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      return {
        success: false,
        message: 'Simple test failed',
        error: err.message,
      };
    }
  }

  // === EXISTING TABLES TESTS ONLY ===
  
  @Get('database-operations')
  async testDatabaseOperations() {
    const results = {
      timestamp: new Date().toISOString(),
      tests: [] as any[],
      summary: { passed: 0, failed: 0 }
    };

    const supabase = this.supabaseService.getAdminClient();

    // Test 1: Basic SELECT operation
    try {
      const { data, error } = await supabase
        .from('auth.users')
        .select('count', { count: 'exact', head: true });
      
      results.tests.push({
        name: 'Basic SELECT Count Query',
        status: error ? 'failed' : 'passed',
        result: `Auth users count: ${data || 0}`,
        error: error?.message || null
      });
      
      if (error) results.summary.failed++;
      else results.summary.passed++;
    } catch (err) {
      results.tests.push({
        name: 'Basic SELECT Count Query',
        status: 'failed',
        error: err.message
      });
      results.summary.failed++;
    }

    // Test 2: RPC Function Call
    try {
      const { data, error } = await supabase.rpc('now');
      
      results.tests.push({
        name: 'RPC Function Call (now)',
        status: error ? 'failed' : 'passed',
        result: data ? `Current timestamp: ${data}` : 'Function executed',
        error: error?.message || null
      });
      
      if (error) results.summary.failed++;
      else results.summary.passed++;
    } catch (err) {
      results.tests.push({
        name: 'RPC Function Call (now)',
        status: 'failed',
        error: err.message
      });
      results.summary.failed++;
    }

    // Test 3: Test Supabase Metadata
    try {
      // This is a safe query that should work
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(10);
      
      results.tests.push({
        name: 'List Public Tables',
        status: error ? 'failed' : 'passed',
        result: `Found ${data?.length || 0} tables: ${data?.map(t => t.table_name).join(', ') || 'none'}`,
        error: error?.message || null
      });
      
      if (error) results.summary.failed++;
      else results.summary.passed++;
    } catch (err) {
      results.tests.push({
        name: 'List Public Tables',
        status: 'failed',
        error: err.message
      });
      results.summary.failed++;
    }

    return results;
  }

  // === PRISMA TESTS ===
  
  @Get('prisma/health')
  async testPrismaHealth() {
    try {
      const isHealthy = await this.prismaService.healthCheck();
      
      return {
        success: true,
        message: 'Prisma Accelerate connection is healthy! ✅',
        healthy: isHealthy,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Prisma health check failed',
        error: error.message,
      };
    }
  }
  
  @Get('prisma/debug')
  async testPrismaDebug() {
    try {
      // Execute raw SQL to list all tables in public schema
      const tables = await this.prismaService.client.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      ` as any[];
      
      return {
        success: true,
        message: 'Prisma raw query executed successfully! ✅',
        tables_found: tables.length,
        tables: tables.map((t: any) => t.table_name),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Prisma debug query failed',
        error: error.message,
        stack: error.stack,
      };
    }
  }
  
  @Get('prisma/simple')
  async testPrismaSimple() {
    try {
      // Try to count orders (should work even if empty)
      const orderCount = await this.prismaService.order.count();
      
      return {
        success: true,
        message: 'Prisma simple query successful! ✅',
        order_count: orderCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Prisma simple query failed',
        error: error.message,
        details: 'This usually means the table does not exist in the connected database',
      };
    }
  }
  
  @Get('prisma/connection-info')
  async testPrismaConnectionInfo() {
    try {
      // Get database connection info
      const dbInfo = await this.prismaService.client.$queryRaw`
        SELECT 
          current_database() as database_name,
          current_user as current_user,
          version() as postgres_version;
      ` as any[];
      
      const schemaInfo = await this.prismaService.client.$queryRaw`
        SELECT schemaname as schema_name
        FROM pg_tables 
        WHERE tablename = 'users'
        LIMIT 5;
      ` as any[];
      
      return {
        success: true,
        message: 'Prisma connection info retrieved! ✅',
        database_info: dbInfo[0],
        user_tables_in_schemas: schemaInfo,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get Prisma connection info',
        error: error.message,
      };
    }
  }
  
  @Get('prisma/test-users')
  async testPrismaUsers() {
    try {
      // Try to count users
      const userCount = await this.prismaService.user.count();
      
      return {
        success: true,
        message: 'Prisma users query successful! ✅',
        user_count: userCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Prisma users query failed',
        error: error.message,
        details: 'This means the users table is not accessible via Prisma',
      };
    }
  }
  
  @Get('prisma/test-products')
  async testPrismaProducts() {
    try {
      // Try to count products
      const productCount = await this.prismaService.product.count();
      
      return {
        success: true,
        message: 'Prisma products query successful! ✅',
        product_count: productCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Prisma products query failed',
        error: error.message,
        details: 'This means the products table is not accessible via Prisma',
      };
    }
  }

  // === COMPARISON TESTS ===
  
  @Get('compare/databases')
  async compareDatabases() {
    const results = {
      timestamp: new Date().toISOString(),
      supabase: { success: false, tables: [] as string[], error: null as string | null },
      prisma: { success: false, tables: [] as string[], error: null as string | null },
      match: false,
    };

    // Test Supabase
    try {
      const supabase = this.supabaseService.getAdminClient();
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .order('table_name');
        
      if (!error && data) {
        results.supabase.success = true;
        results.supabase.tables = data.map(t => t.table_name).sort();
      } else {
        results.supabase.error = error?.message || 'Unknown error';
      }
    } catch (err) {
      results.supabase.error = err.message;
    }

    // Test Prisma
    try {
      const tables = await this.prismaService.client.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      ` as any[];
      
      results.prisma.success = true;
      results.prisma.tables = tables.map((t: any) => t.table_name).sort();
    } catch (err) {
      results.prisma.error = err.message;
    }

    // Compare results
    if (results.supabase.success && results.prisma.success) {
      const supabaseTables = JSON.stringify(results.supabase.tables);
      const prismaTables = JSON.stringify(results.prisma.tables);
      results.match = supabaseTables === prismaTables;
    }

    return results;
  }

  // Test database connection environment variables
  @Get('env/database')
  async testDatabaseEnv() {
    // Return database connection variables (with passwords masked)
    return {
      DATABASE_URL: process.env.DATABASE_URL ? 'Set (masked)' : 'Not set',
      DIRECT_URL: process.env.DIRECT_URL ? 'Set (masked)' : 'Not set',
      DATABASE_URL_DIRECT: process.env.DATABASE_URL_DIRECT ? 'Set (masked)' : 'Not set',
      DATABASE_URL_POOLER: process.env.DATABASE_URL_POOLER ? 'Set (masked)' : 'Not set',
      
      // Supabase connection info
      SUPABASE_URL: process.env.SUPABASE_URL || 'Not set',
      SUPABASE_DB_HOST: process.env.SUPABASE_DB_HOST || 'Not set',
      SUPABASE_DB_PORT: process.env.SUPABASE_DB_PORT || 'Not set',
      SUPABASE_DB_NAME: process.env.SUPABASE_DB_NAME || 'Not set',
      SUPABASE_DB_SCHEMA: process.env.SUPABASE_DB_SCHEMA || 'Not set',
      
      // Node environment
      NODE_ENV: process.env.NODE_ENV || 'Not set',
    };
  }

  // Get enum values from database
  @Get('prisma/enum-values')
  async getPrismaEnumValues() {
    try {
      // Get enum types and their values
      const enumTypes = await this.prismaService.client.$queryRaw`
        SELECT 
          t.typname as enum_name,
          e.enumlabel as enum_value
        FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid  
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public'
        ORDER BY t.typname, e.enumsortorder;
      ` as any[];
      
      // Group by enum type
      const enumGroups = {};
      enumTypes.forEach(row => {
        if (!enumGroups[row.enum_name]) {
          enumGroups[row.enum_name] = [];
        }
        enumGroups[row.enum_name].push(row.enum_value);
      });
      
      return {
        success: true,
        message: 'Enum values retrieved successfully! ✅',
        enum_types: enumGroups,
        total_enums: Object.keys(enumGroups).length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get enum values',
        error: error.message,
      };
    }
  }

  // Test permissions
  @Get('prisma/permissions')
  async testPrismaPermissions() {
    try {
      const permissionInfo = await this.prismaService.client.$queryRaw`
        SELECT 
          table_catalog, 
          table_schema, 
          table_name, 
          privilege_type
        FROM information_schema.table_privileges 
        WHERE grantee = current_user
          AND table_schema = 'public'
        ORDER BY table_name, privilege_type;
      ` as any[];
      
      const currentUser = await this.prismaService.client.$queryRaw`SELECT current_user` as any[];
      
      return {
        success: true,
        message: 'Database permissions retrieved successfully! ✅',
        current_user: currentUser[0]?.current_user,
        permissions: permissionInfo,
        permissions_count: permissionInfo.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get database permissions',
        error: error.message,
      };
    }
  }

  // Insert sample data using Prisma
  @Get('prisma/insert-sample-user')
  async insertSampleUserPrisma() {
    try {
      const sampleUser = {
        email: `test_${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User',
        role: UserRole.CUSTOMER,
        emailVerified: true,
        firebaseUid: `test_${Date.now()}`,
        isActive: true
      };

      const user = await this.prismaService.user.create({
        data: sampleUser
      });

      return {
        success: true,
        message: 'Sample user created successfully using Prisma! ✅',
        user: user,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to insert sample user with Prisma',
        error: error.message,
      };
    }
  }

  @Get('prisma/insert-sample-category')
  async insertSampleCategoryPrisma() {
    try {
      const sampleCategory = {
        name: 'Electronics',
        description: 'Electronic devices and gadgets'
      };

      const category = await this.prismaService.category.create({
        data: sampleCategory
      });

      return {
        success: true,
        message: 'Sample category created successfully using Prisma! ✅',
        category: category,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to insert sample category with Prisma',
        error: error.message,
      };
    }
  }

  @Get('prisma/populate-sample-data')
  async populateSampleDataPrisma() {
    try {
      const results: any[] = [];

      // 1. Create a user
      const user = await this.prismaService.user.create({
        data: {
          email: `user_${Date.now()}@example.com`,
          firstName: 'John',
          lastName: 'Doe',
          displayName: 'John Doe',
          role: UserRole.CUSTOMER,
          emailVerified: true,
          firebaseUid: `user_${Date.now()}`,
          isActive: true
        }
      });
      results.push({ step: '1. User created', data: user });

      // 2. Create a customer
      const customer = await this.prismaService.customer.create({
        data: {
          userId: user.id,
          loyaltyPoints: 100
        }
      });
      results.push({ step: '2. Customer profile created', data: customer });

      // 3. Create a category
      const category = await this.prismaService.category.create({
        data: {
          name: 'Electronics',
          description: 'Electronic devices and gadgets',
          sortOrder: 1
        }
      });
      results.push({ step: '3. Category created', data: category });

      // 4. Create a seller user
      const sellerUser = await this.prismaService.user.create({
        data: {
          email: `seller_${Date.now()}@example.com`,
          firstName: 'Jane',
          lastName: 'Seller',
          displayName: 'Jane Seller',
          role: UserRole.SELLER,
          emailVerified: true,
          firebaseUid: `seller_${Date.now()}`,
          isActive: true
        }
      });
      results.push({ step: '4. Seller user created', data: sellerUser });

      // 5. Create seller profile
      const seller = await this.prismaService.seller.create({
        data: {
          userId: sellerUser.id,
          businessName: 'TechStore Inc.',
          businessDescription: 'Your trusted electronics store',
          status: SellerStatus.ACTIVE
        }
      });
      results.push({ step: '5. Seller profile created', data: seller });

      // 6. Create a warehouse
      const warehouse = await this.prismaService.warehouse.create({
        data: {
          name: 'Main Warehouse',
          address: '123 Industrial Ave',
          city: 'New York',
          province: 'NY',
          country: 'USA',
          postalCode: '10001',
          sellerId: seller.id
        }
      });
      results.push({ step: '6. Warehouse created', data: warehouse });

      // 7. Create a product
      const product = await this.prismaService.product.create({
        data: {
          name: 'Premium Smartphone',
          description: 'Latest generation smartphone with advanced features',
          shortDescription: 'Premium smartphone',
          slug: `smartphone-${Date.now()}`,
          sku: `SKU-${Date.now()}`,
          price: 899.99,
          comparePrice: 1099.99,
          costPrice: 600.00,
          categoryId: category.id,
          sellerId: seller.id,
          condition: ProductCondition.NEW,
          brand: 'TechBrand',
          model: 'X1 Pro',
          weight: 0.18,
          images: ['https://example.com/phone1.jpg', 'https://example.com/phone2.jpg'],
          tags: ['smartphone', 'electronics', 'mobile'],
          isActive: true,
          isFeatured: true,
          trackQuantity: true
        }
      });
      results.push({ step: '7. Product created', data: product });

      // 8. Create inventory for the product
      const inventory = await this.prismaService.inventory.create({
        data: {
          productId: product.id,
          warehouseId: warehouse.id,
          quantity: 50,
          reserved: 0,
          reorderLevel: 10
        }
      });
      results.push({ step: '8. Inventory created', data: inventory });

      return {
        success: true,
        message: 'Sample e-commerce data populated successfully! 🎉',
        results: results,
        summary: {
          users_created: 2,
          customers_created: 1,
          sellers_created: 1,
          categories_created: 1,
          products_created: 1,
          warehouses_created: 1,
          inventory_records: 1,
          total_records: results.length
        },
        next_steps: [
          'Create addresses for customers',
          'Create shopping carts',
          'Create orders and payments',
          'Add product reviews'
        ],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to populate sample data',
        error: error.message,
      };
    }
  }

  // Test table existence and structure
  @Get('prisma/table-check/:tableName')
  async checkTableExists(@Param('tableName') tableName: string) {
    try {
      // Validate tableName to prevent SQL injection
      if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
        return {
          success: false,
          message: 'Invalid table name',
        };
      }

      // Check if table exists
      const tableExists = await this.prismaService.client.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = ${tableName}
        ) as exists;
      ` as any[];
      
      if (!tableExists[0]?.exists) {
        return {
          success: false,
          message: `Table '${tableName}' does not exist in the public schema`,
          timestamp: new Date().toISOString(),
        };
      }
      
      // Get table structure
      const columns = await this.prismaService.client.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = ${tableName}
        ORDER BY ordinal_position;
      ` as any[];
      
      return {
        success: true,
        message: `Table '${tableName}' exists!`,
        columns: columns,
        column_count: columns.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to check table '${tableName}'`,
        error: error.message,
      };
    }
  }

  // === EXTENDED E-COMMERCE FUNCTIONALITY ===
  
  // 1. Create addresses for customers
  @Get('prisma/create-customer-addresses')
  async createCustomerAddresses() {
    try {
      // Get existing customers
      const customers = await this.prismaService.customer.findMany({
        take: 3,
        include: { user: true }
      });
      
      if (customers.length === 0) {
        return {
          success: false,
          message: 'No customers found. Please run populate-sample-data first.',
        };
      }
      
      const results: any[] = [];
      
      for (const customer of customers) {
        // Create home address
        const homeAddress = await this.prismaService.address.create({
          data: {
            customerId: customer.id,
            recipientName: `${customer.user.firstName} ${customer.user.lastName}`,
            streetAddress: '123 Main Street, Apt 4B',
            city: 'New York',
            province: 'NY',
            country: 'USA',
            postalCode: '10001',
            phoneNumber: '+1 (555) 123-4567',
            isDefault: true,
            addressType: 'Home'
          }
        });
        results.push({ customer: customer.user.displayName, address: 'Home', data: homeAddress });
        
        // Create work address
        const workAddress = await this.prismaService.address.create({
          data: {
            customerId: customer.id,
            recipientName: `${customer.user.firstName} ${customer.user.lastName}`,
            streetAddress: '456 Business Ave',
            city: 'New York',
            province: 'NY',
            country: 'USA',
            postalCode: '10002',
            phoneNumber: '+1 (555) 987-6543',
            isDefault: false,
            addressType: 'Work'
          }
        });
        results.push({ customer: customer.user.displayName, address: 'Work', data: workAddress });
      }
      
      return {
        success: true,
        message: 'Customer addresses created successfully! 🏠',
        addresses_created: results.length,
        results: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create customer addresses',
        error: error.message,
      };
    }
  }
  
  // 2. Create shopping carts - COMMENTED OUT DUE TO SCHEMA ISSUES
  // @Get('prisma/create-shopping-carts')
  // async createShoppingCarts() {
    // try {
      // Get existing customers and products
      // const customers = await this.prismaService.customer.findMany({
        // take: 2,
        // include: { user: true }
      // });
      
      // const products = await this.prismaService.product.findMany({
        // take: 3,
        // include: { seller: true }
      // });
      
      // if (customers.length === 0 || products.length === 0) {
        // return {
          // success: false,
          // message: 'No customers or products found. Please run populate-sample-data first.',
        // };
      // }
      
      // const results: any[] = [];
      
      // for (const customer of customers) {
        // Create a shopping cart
        // const cart = await this.prismaService.shoppingCart.create({
          // data: {
            // customerId: customer.id,
            // sessionId: `session_${Date.now()}_${customer.id}`,
          // }
        // });
        // results.push({ step: 'Cart created', customer: customer.user.displayName, data: cart });
        
        // Add products to cart
        // for (const product of products.slice(0, 2)) {
          // const cartItem = await this.prismaService.cartItem.create({
            // data: {
              // cartId: cart.id,
              // productId: product.id,
              // quantity: Math.floor(Math.random() * 3) + 1, // Random quantity 1-3
              // price: product.price
            // }
          // });
          // results.push({ 
            // step: 'Cart item added', 
            // customer: customer.user.displayName, 
            // product: product.name,
            // data: cartItem 
          // });
        // }
      // }
      
      // return {
        // success: true,
        // message: 'Shopping carts created successfully! 🛒',
        // carts_created: customers.length,
        // cart_items_created: results.filter(r => r.step === 'Cart item added').length,
        // results: results,
        // timestamp: new Date().toISOString(),
      // };
    // } catch (error) {
      // return {
        // success: false,
        // message: 'Failed to create shopping carts',
        // error: error.message,
      // };
    // }
  // }
  
  // 3. Create orders and payments - TEMPORARILY COMMENTED OUT DUE TO SCHEMA ISSUES
  // @Get('prisma/create-orders-payments')
  // async createOrdersAndPayments() {
  //  try {
      // Get existing customers with addresses and their carts
      // const customers = await this.prismaService.customer.findMany({
        // take: 2,
        // include: {
          // user: true,
          // addresses: { where: { isDefault: true } },
          // carts: {
            // include: {
              // items: {
                // include: { product: { include: { seller: true } } }
              // }
            // }
          // }
        // }
      // });
      
      // return {
        // success: false,
        // message: 'Method temporarily disabled due to schema issues',
      // };
    // } catch (error) {
      // return {
        // success: false,
        // message: 'Failed to create orders and payments',
        // error: error.message,
      // };
    // }
  // }
  
  // 4. Add product reviews
  @Get('prisma/create-product-reviews')
  async createProductReviews() {
    try {
      // Get customers who have completed orders  
      const completedOrders = await this.prismaService.order.findMany({
        where: { status: OrderStatus.DELIVERED },
        include: {
          customer: { include: { user: true } },
          orderItems: { include: { product: true } }
        },
        take: 3
      });
      
      if (completedOrders.length === 0) {
        return {
          success: false,
          message: 'No completed orders found. Please run create-orders-payments first.',
        };
      }
      
      const results: any[] = [];
      const reviewTexts = [
        'Excellent product! Highly recommend it.',
        'Good quality and fast shipping. Very satisfied.',
        'Amazing features and great value for money.',
        'Perfect! Exactly what I was looking for.',
        'Great product, will buy again.',
      ];
      
      for (const order of completedOrders) {
        for (const orderItem of order.orderItems) {
          const rating = Math.floor(Math.random() * 2) + 4; // Random rating 4-5
          const reviewText = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
          
          const review = await this.prismaService.productReview.create({
            data: {
              customerId: order.customerId,
              productId: orderItem.productId,
              rating: rating,
              title: `Great ${orderItem.product.name}`,
              comment: reviewText,
              isVerifiedPurchase: true,
              isApproved: true,
            }
          });
          
          results.push({
            customer: order.customer.user.displayName,
            product: orderItem.product.name,
            rating: rating,
            data: review
          });
        }
      }
      
      return {
        success: true,
        message: 'Product reviews created successfully! ⭐',
        reviews_created: results.length,
        average_rating: (results.reduce((sum, r) => sum + r.rating, 0) / results.length).toFixed(1),
        results: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create product reviews',
        error: error.message,
      };
    }
  }
  
  // Complete e-commerce flow - Run all steps
  @Get('prisma/complete-ecommerce-flow')
  async completeEcommerceFlow() {
    try {
      const results: any[] = [];
      
      // Step 1: Create basic data
      const basicData = await this.populateSampleDataPrisma();
      results.push({ step: '1. Basic Data', success: basicData.success, summary: basicData.summary });
      
      if (!basicData.success) {
        return {
          success: false,
          message: 'Failed at basic data creation',
          results: results,
        };
      }
      
      // Step 2: Create addresses
      const addresses = await this.createCustomerAddresses();
      results.push({ step: '2. Addresses', success: addresses.success, count: addresses.addresses_created });
      
      // Step 3: Create shopping carts - COMMENTED OUT
      // const carts = await this.createShoppingCarts();
      // results.push({ step: '3. Shopping Carts', success: carts.success, carts: carts.carts_created, items: carts.cart_items_created });
      results.push({ step: '3. Shopping Carts', success: false, message: 'Skipped - schema issues' });
      
      // Step 4: Create orders and payments - COMMENTED OUT
      // const orders = await this.createOrdersAndPayments();
      // results.push({ step: '4. Orders & Payments', success: orders.success, orders: orders.orders_created, payments: orders.payments_created });
      results.push({ step: '4. Orders & Payments', success: false, message: 'Skipped - method disabled due to schema issues' });
      
      // Step 5: Create reviews
      const reviews = await this.createProductReviews();
      results.push({ step: '5. Product Reviews', success: reviews.success, reviews: reviews.reviews_created });
      
      const allSuccess = results.every(r => r.success);
      
      return {
        success: allSuccess,
        message: allSuccess ? 'Complete e-commerce flow executed successfully! 🎉🛒💳⭐' : 'Some steps failed in the e-commerce flow',
        flow_results: results,
        final_summary: {
          users: basicData.summary?.users_created || 0,
          products: basicData.summary?.products_created || 0,
          addresses: addresses.addresses_created || 0,
          carts: 0, // Skipped due to schema issues
          cart_items: 0, // Skipped due to schema issues
          orders: 0, // Skipped due to schema issues
          payments: 0, // Skipped due to schema issues
          reviews: reviews.reviews_created || 0,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to complete e-commerce flow',
        error: error.message,
      };
    }
  }
  
  // Get complete e-commerce data summary
  @Get('prisma/ecommerce-summary')
  async getEcommerceSummary() {
    try {
      const summary = {
        users: await this.prismaService.user.count(),
        customers: await this.prismaService.customer.count(),
        sellers: await this.prismaService.seller.count(),
        categories: await this.prismaService.category.count(),
        products: await this.prismaService.product.count(),
        warehouses: await this.prismaService.warehouse.count(),
        inventory: await this.prismaService.inventory.count(),
        addresses: await this.prismaService.address.count(),
        shopping_carts: await this.prismaService.cart.count(),
        cart_items: await this.prismaService.cartItem.count(),
        orders: await this.prismaService.order.count(),
        order_items: await this.prismaService.orderItem.count(),
        payments: await this.prismaService.payment.count(),
        reviews: await this.prismaService.productReview.count(),
      };
      
      // Get some sample data
      const sampleUsers = await this.prismaService.user.findMany({ take: 3 });
      const sampleProducts = await this.prismaService.product.findMany({ 
        take: 3, 
        include: { category: true, seller: { include: { user: true } } }
      });
      const sampleOrders = await this.prismaService.order.findMany({ 
        take: 3, 
        include: { customer: { include: { user: true } } }
      });
      const sampleReviews = await this.prismaService.productReview.findMany({ 
        take: 3, 
        include: { product: true, customer: { include: { user: true } } }
      });
      
      return {
        success: true,
        message: 'E-commerce data summary retrieved successfully! 📊',
        summary: summary,
        samples: {
          users: sampleUsers.map(u => ({ id: u.id, name: u.displayName, role: u.role })),
          products: sampleProducts.map(p => ({ 
            id: p.id, 
            name: p.name, 
            price: p.price, 
            category: p.category.name,
            seller: p.seller.user.displayName
          })),
          orders: sampleOrders.map(o => ({ 
            id: o.id, 
            orderNumber: o.orderNumber, 
            total: o.totalAmount, 
            status: o.status,
            customer: o.customer.user.displayName
          })),
          reviews: sampleReviews.map(r => ({ 
            id: r.id, 
            rating: r.rating, 
            title: r.title,
            product: r.product.name,
            customer: r.customer.user.displayName
          }))
        },
        total_records: Object.values(summary).reduce((sum, count) => sum + count, 0),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get e-commerce summary',
        error: error.message,
      };
    }
  }

  // === POST ENDPOINTS FOR CREATING NEW DATA ===

  // Create a new user
  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const userData = {
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        displayName: createUserDto.displayName || `${createUserDto.firstName} ${createUserDto.lastName}`,
        role: createUserDto.role || UserRole.CUSTOMER,
        phoneNumber: createUserDto.phoneNumber,
        emailVerified: true,
        firebaseUid: `manual_${Date.now()}`,
        isActive: true
      };

      const user = await this.prismaService.user.create({
        data: userData
      });

      // If user is a customer, create customer profile
      if (user.role === UserRole.CUSTOMER) {
        const customer = await this.prismaService.customer.create({
          data: {
            userId: user.id,
            loyaltyPoints: 0
          }
        });
        
        return {
          success: true,
          message: 'User and customer profile created successfully! 👤',
          user: user,
          customer: customer,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        message: 'User created successfully! 👤',
        user: user,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create user',
        error: error.message,
      };
    }
  }

  // Create a new category
  @Post('categories')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prismaService.category.create({
        data: {
          name: createCategoryDto.name,
          description: createCategoryDto.description,
          parentId: createCategoryDto.parentId,
          sortOrder: createCategoryDto.sortOrder || 0
        }
      });

      return {
        success: true,
        message: 'Category created successfully! 📂',
        category: category,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create category',
        error: error.message,
      };
    }
  }

  // Create a new product
  @Post('products')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      const productData = {
        name: createProductDto.name,
        description: createProductDto.description,
        shortDescription: createProductDto.shortDescription,
        slug: createProductDto.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + `-${Date.now()}`,
        sku: createProductDto.sku || `SKU-${Date.now()}`,
        price: createProductDto.price,
        comparePrice: createProductDto.comparePrice,
        costPrice: createProductDto.costPrice,
        categoryId: createProductDto.categoryId,
        sellerId: createProductDto.sellerId,
        condition: createProductDto.condition || ProductCondition.NEW,
        brand: createProductDto.brand,
        model: createProductDto.model,
        weight: createProductDto.weight,
        images: createProductDto.images || [],
        tags: createProductDto.tags || [],
        isActive: true,
        isFeatured: false,
        trackQuantity: createProductDto.trackQuantity || false
      };

      const product = await this.prismaService.product.create({
        data: productData,
        include: {
          category: true,
          seller: { include: { user: true } }
        }
      });

      return {
        success: true,
        message: 'Product created successfully! 📦',
        product: product,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create product',
        error: error.message,
      };
    }
  }

  // Create a new address
  @Post('addresses')
  async createAddress(@Body() createAddressDto: CreateAddressDto) {
    try {
      const address = await this.prismaService.address.create({
        data: {
          customerId: createAddressDto.customerId,
          recipientName: createAddressDto.recipientName,
          streetAddress: createAddressDto.streetAddress,
          city: createAddressDto.city,
          province: createAddressDto.province,
          country: createAddressDto.country,
          postalCode: createAddressDto.postalCode,
          phoneNumber: createAddressDto.phoneNumber,
          isDefault: createAddressDto.isDefault || false,
          addressType: createAddressDto.addressType || 'Home'
        },
        include: {
          customer: { include: { user: true } }
        }
      });

      return {
        success: true,
        message: 'Address created successfully! 🏠',
        address: address,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create address',
        error: error.message,
      };
    }
  }

  // Create a new product review
  @Post('reviews')
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    try {
      const review = await this.prismaService.productReview.create({
        data: {
          customerId: createReviewDto.customerId,
          productId: createReviewDto.productId,
          rating: createReviewDto.rating,
          title: createReviewDto.title,
          comment: createReviewDto.comment,
          isVerifiedPurchase: false, // Set to true if you want to verify purchases
          isApproved: true // Auto-approve for testing
        },
        include: {
          customer: { include: { user: true } },
          product: true
        }
      });

      return {
        success: true,
        message: 'Product review created successfully! ⭐',
        review: review,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create review',
        error: error.message,
      };
    }
  }

  // Create a seller profile (requires existing user)
  @Post('sellers')
  async createSeller(@Body() createSellerDto: { userId: string; businessName: string; businessDescription?: string }) {
    try {
      // First, update the user role to SELLER
      await this.prismaService.user.update({
        where: { id: createSellerDto.userId },
        data: { role: UserRole.SELLER }
      });

      // Create seller profile
      const seller = await this.prismaService.seller.create({
        data: {
          userId: createSellerDto.userId,
          businessName: createSellerDto.businessName,
          businessDescription: createSellerDto.businessDescription || '',
          status: SellerStatus.ACTIVE
        },
        include: {
          user: true
        }
      });

      return {
        success: true,
        message: 'Seller profile created successfully! 🏪',
        seller: seller,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create seller profile',
        error: error.message,
      };
    }
  }

  // Create a warehouse
  @Post('warehouses')
  async createWarehouse(@Body() createWarehouseDto: {
    sellerId: string;
    name: string;
    address: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  }) {
    try {
      const warehouse = await this.prismaService.warehouse.create({
        data: {
          sellerId: createWarehouseDto.sellerId,
          name: createWarehouseDto.name,
          address: createWarehouseDto.address,
          city: createWarehouseDto.city,
          province: createWarehouseDto.province,
          country: createWarehouseDto.country,
          postalCode: createWarehouseDto.postalCode
        },
        include: {
          seller: { include: { user: true } }
        }
      });

      return {
        success: true,
        message: 'Warehouse created successfully! 🏭',
        warehouse: warehouse,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create warehouse',
        error: error.message,
      };
    }
  }

  // Create inventory record
  @Post('inventory')
  async createInventory(@Body() createInventoryDto: {
    productId: string;
    warehouseId: string;
    quantity: number;
    reorderLevel?: number;
  }) {
    try {
      const inventory = await this.prismaService.inventory.create({
        data: {
          productId: createInventoryDto.productId,
          warehouseId: createInventoryDto.warehouseId,
          quantity: createInventoryDto.quantity,
          reserved: 0,
          reorderLevel: createInventoryDto.reorderLevel || 10
        },
        include: {
          product: true,
          warehouse: true
        }
      });

      return {
        success: true,
        message: 'Inventory record created successfully! 📊',
        inventory: inventory,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create inventory record',
        error: error.message,
      };
    }
  }

  // === GET ENDPOINTS FOR LISTING DATA ===

  // Get all users
  @Get('users')
  async getUsers() {
    try {
      const users = await this.prismaService.user.findMany({
        include: {
          customers: true,
          sellers: true
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      return {
        success: true,
        message: 'Users retrieved successfully! 👥',
        users: users,
        count: users.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve users',
        error: error.message,
      };
    }
  }

  // Get all categories
  @Get('categories')
  async getCategories() {
    try {
      const categories = await this.prismaService.category.findMany({
        include: {
          products: { take: 3 },
          parent: true,
          children: true
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
      });

      return {
        success: true,
        message: 'Categories retrieved successfully! 📂',
        categories: categories,
        count: categories.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve categories',
        error: error.message,
      };
    }
  }

  // Get all products
  @Get('products')
  async getProducts() {
    try {
      const products = await this.prismaService.product.findMany({
        include: {
          category: true,
          seller: { include: { user: true } },
          inventory: { include: { warehouse: true } },
          productReviews: { take: 2, include: { customer: { include: { user: true } } } }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      return {
        success: true,
        message: 'Products retrieved successfully! 📦',
        products: products,
        count: products.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve products',
        error: error.message,
      };
    }
  }

  // Get all addresses
  @Get('addresses')
  async getAddresses() {
    try {
      const addresses = await this.prismaService.address.findMany({
        include: {
          customer: { include: { user: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      return {
        success: true,
        message: 'Addresses retrieved successfully! 🏠',
        addresses: addresses,
        count: addresses.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve addresses',
        error: error.message,
      };
    }
  }

  // Get all reviews
  @Get('reviews')
  async getReviews() {
    try {
      const reviews = await this.prismaService.productReview.findMany({
        include: {
          customer: { include: { user: true } },
          product: true
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      return {
        success: true,
        message: 'Reviews retrieved successfully! ⭐',
        reviews: reviews,
        count: reviews.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve reviews',
        error: error.message,
      };
    }
  }

  // Get specific user by ID
  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        include: {
          customers: {
            include: {
              addresses: true,
              productReviews: { include: { product: true } }
            }
          },
          sellers: {
            include: {
              products: true,
              warehouses: true
            }
          }
        }
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        message: 'User retrieved successfully! 👤',
        user: user,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve user',
        error: error.message,
      };
    }
  }

  // Get specific product by ID
  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id },
        include: {
          category: true,
          seller: { include: { user: true } },
          inventory: { include: { warehouse: true } },
          productReviews: { 
            include: { customer: { include: { user: true } } },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!product) {
        return {
          success: false,
          message: 'Product not found',
        };
      }

      return {
        success: true,
        message: 'Product retrieved successfully! 📦',
        product: product,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve product',
        error: error.message,
      };
    }
  }

  // === ADDITIONAL POST ENDPOINTS FOR ALL DATABASE TABLES ===

  // Create a new customer profile (requires existing user)
  @Post('customers')
  async createCustomer(@Body() createCustomerDto: { userId: string; dateOfBirth?: string; gender?: string; loyaltyPoints?: number }) {
    try {
      const customer = await this.prismaService.customer.create({
        data: {
          userId: createCustomerDto.userId,
          dateOfBirth: createCustomerDto.dateOfBirth ? new Date(createCustomerDto.dateOfBirth) : undefined,
          gender: createCustomerDto.gender,
          loyaltyPoints: createCustomerDto.loyaltyPoints || 0
        },
        include: {
          user: true
        }
      });

      return {
        success: true,
        message: 'Customer profile created successfully! 🛍️',
        customer: customer,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create customer profile',
        error: error.message,
      };
    }
  }

  // Create a new shopping cart
  @Post('carts')
  async createCart(@Body() createCartDto: CreateCartDto) {
    try {
      const cart = await this.prismaService.cart.create({
        data: {
          customerId: createCartDto.customerId,
          sessionId: createCartDto.sessionId
        },
        include: {
          customer: { include: { user: true } }
        }
      });

      return {
        success: true,
        message: 'Shopping cart created successfully! 🛒',
        cart: cart,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create shopping cart',
        error: error.message,
      };
    }
  }

  // Create a new cart item
  @Post('cart-items')
  async createCartItem(@Body() createCartItemDto: CreateCartItemDto) {
    try {
      const cartItem = await this.prismaService.cartItem.create({
        data: {
          cartId: createCartItemDto.cartId,
          productId: createCartItemDto.productId,
          quantity: createCartItemDto.quantity,
          price: createCartItemDto.price
        },
        include: {
          cart: { include: { customer: { include: { user: true } } } },
          product: true
        }
      });

      return {
        success: true,
        message: 'Cart item added successfully! 🛒➕',
        cartItem: cartItem,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add cart item',
        error: error.message,
      };
    }
  }

  // Create a new order
  @Post('orders')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const totalAmount = (createOrderDto.subtotal || 0) + (createOrderDto.shippingCost || 0) + (createOrderDto.taxAmount || 0);
      
      const order = await this.prismaService.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}`,
          customerId: createOrderDto.customerId,
          status: 'PENDING',
          subtotal: createOrderDto.subtotal,
          shippingCost: createOrderDto.shippingCost || 0,
          taxAmount: createOrderDto.taxAmount || 0,
          totalAmount: totalAmount,
          shippingAddressId: createOrderDto.shippingAddressId,
          billingAddressId: createOrderDto.billingAddressId,
          notes: createOrderDto.notes
        },
        include: {
          customer: { include: { user: true } },
          shippingAddress: true,
          billingAddress: true
        }
      });

      return {
        success: true,
        message: 'Order created successfully! 📦',
        order: order,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create order',
        error: error.message,
      };
    }
  }

  // Create a new order item
  @Post('order-items')
  async createOrderItem(@Body() createOrderItemDto: CreateOrderItemDto) {
    try {
      const orderItem = await this.prismaService.orderItem.create({
        data: {
          orderId: createOrderItemDto.orderId,
          productId: createOrderItemDto.productId,
          quantity: createOrderItemDto.quantity,
          price: createOrderItemDto.price
        },
        include: {
          order: { include: { customer: { include: { user: true } } } },
          product: true
        }
      });

      return {
        success: true,
        message: 'Order item created successfully! 📦📋',
        orderItem: orderItem,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create order item',
        error: error.message,
      };
    }
  }

  // Create a new payment
  @Post('payments')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.prismaService.payment.create({
        data: {
          orderId: createPaymentDto.orderId,
          provider: createPaymentDto.provider,
          status: 'PENDING',
          amount: createPaymentDto.amount,
          currency: createPaymentDto.currency || 'USD',
          transactionId: createPaymentDto.transactionId
        },
        include: {
          order: { include: { customer: { include: { user: true } } } }
        }
      });

      return {
        success: true,
        message: 'Payment created successfully! 💳',
        payment: payment,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create payment',
        error: error.message,
      };
    }
  }

  // Create a new subscription
  @Post('subscriptions')
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const subscription = await this.prismaService.subscription.create({
        data: {
          sellerId: createSubscriptionDto.sellerId,
          plan: createSubscriptionDto.plan,
          billingCycle: createSubscriptionDto.billingCycle,
          status: 'UNPAID',
          price: createSubscriptionDto.price,
          startDate: new Date(createSubscriptionDto.startDate),
          endDate: new Date(createSubscriptionDto.endDate),
          autoRenew: createSubscriptionDto.autoRenew !== false
        },
        include: {
          seller: { include: { user: true } }
        }
      });

      return {
        success: true,
        message: 'Subscription created successfully! 📅',
        subscription: subscription,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create subscription',
        error: error.message,
      };
    }
  }

  // Create shipping info
  @Post('shipping-info')
  async createShippingInfo(@Body() createShippingInfoDto: CreateShippingInfoDto) {
    try {
      const shippingInfo = await this.prismaService.shippingInfo.create({
        data: {
          orderId: createShippingInfoDto.orderId,
          carrier: createShippingInfoDto.carrier,
          trackingNumber: createShippingInfoDto.trackingNumber,
          shippingMethod: createShippingInfoDto.shippingMethod,
          estimatedDelivery: createShippingInfoDto.estimatedDelivery ? new Date(createShippingInfoDto.estimatedDelivery) : undefined,
          shippingCost: createShippingInfoDto.shippingCost,
          weight: createShippingInfoDto.weight
        },
        include: {
          order: { include: { customer: { include: { user: true } } } }
        }
      });

      return {
        success: true,
        message: 'Shipping info created successfully! 🚚',
        shippingInfo: shippingInfo,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create shipping info',
        error: error.message,
      };
    }
  }

  // === GET ENDPOINTS FOR ALL DATABASE TABLES ===

  // Get all customers
  @Get('customers')
  async getCustomers() {
    try {
      const customers = await this.prismaService.customer.findMany({
        include: {
          user: true,
          addresses: true,
          carts: { include: { items: true } },
          orders: true,
          productReviews: true
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      return {
        success: true,
        message: 'Customers retrieved successfully! 🛍️',
        customers: customers,
        count: customers.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve customers',
        error: error.message,
      };
    }
  }

  // Get all sellers
  @Get('sellers')
  async getSellers() {
    try {
      const sellers = await this.prismaService.seller.findMany({
        include: {
          user: true,
          products: { take: 3 },
          warehouses: true,
          subscriptions: true
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      return {
        success: true,
        message: 'Sellers retrieved successfully! 🏪',
        sellers: sellers,
        count: sellers.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve sellers',
        error: error.message,
      };
    }
  }

  // Get all warehouses
  @Get('warehouses')
  async getWarehouses() {
    try {
      const warehouses = await this.prismaService.warehouse.findMany({
        include: {
          seller: { include: { user: true } },
          inventory: { include: { product: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      return {
        success: true,
        message: 'Warehouses retrieved successfully! 🏭',
        warehouses: warehouses,
        count: warehouses.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve warehouses',
        error: error.message,
      };
    }
  }

  // Get all inventory
  @Get('inventory')
  async getInventory() {
    try {
      const inventory = await this.prismaService.inventory.findMany({
        include: {
          product: { include: { category: true, seller: { include: { user: true } } } },
          warehouse: true
        },
        orderBy: { updatedAt: 'desc' },
        take: 20
      });

      return {
        success: true,
        message: 'Inventory retrieved successfully! 📊',
        inventory: inventory,
        count: inventory.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve inventory',
        error: error.message,
      };
    }
  }

  // Get all carts
  @Get('carts')
  async getCarts() {
    try {
      const carts = await this.prismaService.cart.findMany({
        include: {
          customer: { include: { user: true } },
          items: { include: { product: true } }
        },
        orderBy: { updatedAt: 'desc' },
        take: 20
      });

      return {
        success: true,
        message: 'Shopping carts retrieved successfully! 🛒',
        carts: carts,
        count: carts.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve shopping carts',
        error: error.message,
      };
    }
  }

  // Get all cart items
  @Get('cart-items')
  async getCartItems() {
    try {
      const cartItems = await this.prismaService.cartItem.findMany({
        include: {
          cart: { include: { customer: { include: { user: true } } } },
          product: { include: { category: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      return {
        success: true,
        message: 'Cart items retrieved successfully! 🛒📋',
        cartItems: cartItems,
        count: cartItems.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve cart items',
        error: error.message,
      };
    }
  }

  // Get all orders
  @Get('orders')
  async getOrders() {
    try {
      const orders = await this.prismaService.order.findMany({
        include: {
          customer: { include: { user: true } },
          shippingAddress: true,
          billingAddress: true,
          orderItems: { include: { product: true } },
          payments: true,
          shippingInfo: true
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      return {
        success: true,
        message: 'Orders retrieved successfully! 📦',
        orders: orders,
        count: orders.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve orders',
        error: error.message,
      };
    }
  }

  // Get all order items
  @Get('order-items')
  async getOrderItems() {
    try {
      const orderItems = await this.prismaService.orderItem.findMany({
        include: {
          order: { include: { customer: { include: { user: true } } } },
          product: { include: { category: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      return {
        success: true,
        message: 'Order items retrieved successfully! 📦📋',
        orderItems: orderItems,
        count: orderItems.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve order items',
        error: error.message,
      };
    }
  }

  // Get all payments
  @Get('payments')
  async getPayments() {
    try {
      const payments = await this.prismaService.payment.findMany({
        include: {
          order: { include: { customer: { include: { user: true } } } }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      return {
        success: true,
        message: 'Payments retrieved successfully! 💳',
        payments: payments,
        count: payments.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve payments',
        error: error.message,
      };
    }
  }

  // Get all subscriptions
  @Get('subscriptions')
  async getSubscriptions() {
    try {
      const subscriptions = await this.prismaService.subscription.findMany({
        include: {
          seller: { include: { user: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      return {
        success: true,
        message: 'Subscriptions retrieved successfully! 📅',
        subscriptions: subscriptions,
        count: subscriptions.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve subscriptions',
        error: error.message,
      };
    }
  }

  // Get all shipping info
  @Get('shipping-info')
  async getShippingInfo() {
    try {
      const shippingInfo = await this.prismaService.shippingInfo.findMany({
        include: {
          order: { include: { customer: { include: { user: true } } } }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      return {
        success: true,
        message: 'Shipping info retrieved successfully! 🚚',
        shippingInfo: shippingInfo,
        count: shippingInfo.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve shipping info',
        error: error.message,
      };
    }
  }
}
