import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, SellerStatus, ProductCondition } from '@prisma/client';

@Controller('test-simple')
export class TestSimpleController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  getHello(): string {
    return 'Simple Test Controller is working! 🚀';
  }

  // Basic functionality that we know works
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

      return {
        success: true,
        message: 'Sample data populated successfully! 🎉',
        results: results,
        summary: {
          users_created: 2,
          customers_created: 1,
          sellers_created: 1,
          categories_created: 1,
          total_records: results.length
        },
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

  // Create addresses - simplified version
  @Get('prisma/create-customer-addresses')
  async createCustomerAddresses() {
    try {
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
        const address = await this.prismaService.address.create({
          data: {
            customerId: customer.id,
            recipientName: `${customer.user.firstName} ${customer.user.lastName}`,
            streetAddress: '123 Main Street',
            city: 'New York',
            province: 'NY',
            country: 'USA',
            postalCode: '10001',
            phoneNumber: '+1 (555) 123-4567',
            isDefault: true
          }
        });
        results.push({ customer: customer.user.displayName, data: address });
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

  // Create carts - simplified version
  @Get('prisma/create-shopping-carts')
  async createShoppingCarts() {
    try {
      const customers = await this.prismaService.customer.findMany({
        take: 2,
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
        const cart = await this.prismaService.cart.create({
          data: {
            customerId: customer.id,
            sessionId: `session_${Date.now()}_${customer.id}`,
          }
        });
        results.push({ customer: customer.user.displayName, data: cart });
      }
      
      return {
        success: true,
        message: 'Shopping carts created successfully! 🛒',
        carts_created: customers.length,
        results: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create shopping carts',
        error: error.message,
      };
    }
  }

  // Get summary
  @Get('prisma/ecommerce-summary')
  async getEcommerceSummary() {
    try {
      const summary = {
        users: await this.prismaService.user.count(),
        customers: await this.prismaService.customer.count(),
        sellers: await this.prismaService.seller.count(),
        categories: await this.prismaService.category.count(),
        addresses: await this.prismaService.address.count(),
        carts: await this.prismaService.cart.count(),
      };
      
      return {
        success: true,
        message: 'E-commerce data summary retrieved successfully! 📊',
        summary: summary,
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
}
