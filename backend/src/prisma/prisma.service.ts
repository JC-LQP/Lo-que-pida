import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// import { withAccelerate } from '@prisma/extension-accelerate';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private _client: PrismaClient; // Using direct PrismaClient
  
  constructor() {
    this._client = new PrismaClient();
    // this._client = client.$extends(withAccelerate()); // Temporarily disabled
  }

  // Get the accelerated client
  get client() {
    return this._client;
  }

  async onModuleInit() {
    try {
      await this._client.$connect();
      this.logger.log('Successfully connected to database via direct Prisma connection');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this._client.$disconnect();
    this.logger.log('🔌 Disconnected from database');
  }

  // Helper methods for common database operations
  async healthCheck(): Promise<boolean> {
    try {
      await this._client.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  // Transaction wrapper
  async executeTransaction<T>(
    fn: (prisma: PrismaClient) => Promise<T>
  ): Promise<T> {
    return this._client.$transaction(async (tx) => {
      return fn(tx as PrismaClient);
    });
  }

  // Expose common Prisma methods
  get user() { return this._client.user; }
  get customer() { return this._client.customer; }
  get seller() { return this._client.seller; }
  get product() { return this._client.product; }
  get category() { return this._client.category; }
  get inventory() { return this._client.inventory; }
  get cart() { return this._client.cart; }
  get cartItem() { return this._client.cartItem; }
  get order() { return this._client.order; }
  get orderItem() { return this._client.orderItem; }
  get payment() { return this._client.payment; }
  get productReview() { return this._client.productReview; }
  get subscription() { return this._client.subscription; }
  get address() { return this._client.address; }
  get shippingInfo() { return this._client.shippingInfo; }
  get warehouse() { return this._client.warehouse; }
}
