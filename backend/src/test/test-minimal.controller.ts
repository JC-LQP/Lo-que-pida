import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, SellerStatus, ProductCondition } from '@prisma/client';

@Controller('test')
export class TestMinimalController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  getHello(): string {
    return 'Hello! Your NestJS backend is running successfully! 🚀';
  }

  // Prisma health check
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

  // Test basic functionality
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
        message: 'Sample e-commerce data populated successfully! 🎉',
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

  // Basic summary
  @Get('prisma/summary')
  async getBasicSummary() {
    try {
      const summary = {
        users: await this.prismaService.user.count(),
        customers: await this.prismaService.customer.count(),
        sellers: await this.prismaService.seller.count(),
        categories: await this.prismaService.category.count(),
      };
      
      return {
        success: true,
        message: 'Database summary retrieved successfully! 📊',
        summary: summary,
        total_records: Object.values(summary).reduce((sum, count) => sum + count, 0),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get database summary',
        error: error.message,
      };
    }
  }
}
