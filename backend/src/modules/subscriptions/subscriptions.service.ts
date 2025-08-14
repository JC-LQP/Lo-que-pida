import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from '../../common/dto/subscriptions/subscription.dto';
import { SubscriptionStatus, BillingCycle } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    try {
      // Check if seller exists
      const seller = await this.prisma.seller.findUnique({
        where: { id: createSubscriptionDto.customerId }, // Using customerId as sellerId per DTO structure
      });

      if (!seller) {
        throw new NotFoundException('Seller not found');
      }

      // Check if seller already has an active subscription
      const existingSubscription = await this.prisma.subscription.findFirst({
        where: {
          sellerId: createSubscriptionDto.customerId,
          status: SubscriptionStatus.ACTIVE,
        },
      });

      if (existingSubscription) {
        throw new BadRequestException('Seller already has an active subscription');
      }

      const subscription = await this.prisma.subscription.create({
        data: {
          sellerId: createSubscriptionDto.customerId,
          plan: createSubscriptionDto.plan as any,
          billingCycle: createSubscriptionDto.billingCycle as any,
          price: createSubscriptionDto.price,
          startDate: createSubscriptionDto.startDate ? new Date(createSubscriptionDto.startDate) : new Date(),
          endDate: createSubscriptionDto.endDate ? new Date(createSubscriptionDto.endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default to 1 year from now
          nextBillingDate: this.calculateNextBillingDate(
            createSubscriptionDto.billingCycle as any,
            createSubscriptionDto.startDate ? new Date(createSubscriptionDto.startDate) : new Date()
          ),
        },
        include: {
          seller: {
            include: {
              user: {
                select: {
                  displayName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      return this.transformSubscription(subscription);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  async findAll(page: number = 1, limit: number = 10, status?: string) {
    const skip = (page - 1) * limit;
    
    let where: any = {};
    
    if (status) {
      where.status = status;
    }

    const [subscriptions, total] = await Promise.all([
      this.prisma.subscription.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: {
            include: {
              user: {
                select: {
                  displayName: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.subscription.count({ where }),
    ]);

    return {
      subscriptions: subscriptions.map(subscription => this.transformSubscription(subscription)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
        include: {
          seller: {
            include: {
              user: {
                select: {
                  displayName: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return this.transformSubscription(subscription);
  }

  async findBySeller(sellerId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [subscriptions, total] = await Promise.all([
      this.prisma.subscription.findMany({
        skip,
        take: limit,
        where: { sellerId },
        orderBy: { createdAt: 'desc' },
        include: {
          seller: {
            include: {
              user: {
                select: {
                  displayName: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.subscription.count({ where: { sellerId } }),
    ]);

    return {
      subscriptions: subscriptions.map(subscription => this.transformSubscription(subscription)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    const existingSubscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!existingSubscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    try {
      let updateData: any = {};
      
      // Map DTO fields to schema fields
      if (updateSubscriptionDto.plan) updateData.plan = updateSubscriptionDto.plan as any;
      if (updateSubscriptionDto.billingCycle) updateData.billingCycle = updateSubscriptionDto.billingCycle as any;
      if (updateSubscriptionDto.price) updateData.price = updateSubscriptionDto.price;
      if (updateSubscriptionDto.status) updateData.status = updateSubscriptionDto.status as any;
      if (updateSubscriptionDto.endDate) updateData.endDate = new Date(updateSubscriptionDto.endDate);

      // Recalculate next billing date if billing cycle changed
      if (updateSubscriptionDto.billingCycle && (updateSubscriptionDto.billingCycle as BillingCycle) !== existingSubscription.billingCycle) {
        updateData.nextBillingDate = this.calculateNextBillingDate(
          updateSubscriptionDto.billingCycle as any,
          existingSubscription.nextBillingDate || new Date()
        );
      }

      const subscription = await this.prisma.subscription.update({
        where: { id },
        data: updateData,
        include: {
          seller: {
            include: {
              user: {
                select: {
                  displayName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      return this.transformSubscription(subscription);
    } catch (error) {
      throw new Error(`Failed to update subscription: ${error.message}`);
    }
  }

  async cancel(id: string, reason?: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new BadRequestException('Subscription is already cancelled');
    }

    try {
      const updatedSubscription = await this.prisma.subscription.update({
        where: { id },
        data: {
          status: SubscriptionStatus.CANCELLED,
          // Note: cancelledAt and cancelReason fields don't exist in schema
        },
        include: {
          seller: {
            include: {
              user: {
                select: {
                  displayName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      return this.transformSubscription(updatedSubscription);
    } catch (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  async pause(id: string, resumeDate?: Date) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('Only active subscriptions can be paused');
    }

    try {
      const updatedSubscription = await this.prisma.subscription.update({
        where: { id },
        data: {
          status: SubscriptionStatus.PAUSED,
          // Note: pausedAt and resumeDate fields don't exist in schema
        },
      });

      return this.transformSubscription(updatedSubscription);
    } catch (error) {
      throw new Error(`Failed to pause subscription: ${error.message}`);
    }
  }

  async resume(id: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    if (subscription.status !== SubscriptionStatus.PAUSED) {
      throw new BadRequestException('Only paused subscriptions can be resumed');
    }

    try {
      const updatedSubscription = await this.prisma.subscription.update({
        where: { id },
        data: {
          status: SubscriptionStatus.ACTIVE,
          nextBillingDate: this.calculateNextBillingDate(
            subscription.billingCycle,
            new Date()
          ),
        },
      });

      return this.transformSubscription(updatedSubscription);
    } catch (error) {
      throw new Error(`Failed to resume subscription: ${error.message}`);
    }
  }

  async getDueSubscriptions() {
    const now = new Date();
    
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        nextBillingDate: {
          lte: now,
        },
      },
      include: {
        seller: {
          include: {
            user: {
              select: {
                email: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    return subscriptions.map(subscription => this.transformSubscription(subscription));
  }

  async getSubscriptionStats() {
    const [
      totalSubscriptions,
      activeSubscriptions,
      pausedSubscriptions,
      cancelledSubscriptions,
      totalRevenue,
      recentSubscriptions,
    ] = await Promise.all([
      this.prisma.subscription.count(),
      this.prisma.subscription.count({ where: { status: SubscriptionStatus.ACTIVE } }),
      this.prisma.subscription.count({ where: { status: SubscriptionStatus.PAUSED } }),
      this.prisma.subscription.count({ where: { status: SubscriptionStatus.CANCELLED } }),
      this.prisma.subscription.aggregate({
        where: { status: SubscriptionStatus.ACTIVE },
        _sum: { price: true },
      }),
      this.prisma.subscription.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      totalSubscriptions,
      activeSubscriptions,
      pausedSubscriptions,
      cancelledSubscriptions,
      monthlyRecurringRevenue: totalRevenue._sum?.price?.toNumber() || 0,
      recentSubscriptions,
      churnRate: totalSubscriptions > 0 
        ? ((cancelledSubscriptions / totalSubscriptions) * 100).toFixed(1)
        : '0',
    };
  }

  private calculateNextBillingDate(billingCycle: string, startDate: Date): Date {
    const date = new Date(startDate);
    
    switch (billingCycle) {
      case 'WEEKLY':
        date.setDate(date.getDate() + 7);
        break;
      case 'MONTHLY':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'QUARTERLY':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'YEARLY':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        throw new Error(`Invalid billing cycle: ${billingCycle}`);
    }
    
    return date;
  }

  private transformSubscription(subscription: any) {
    return {
      ...subscription,
      price: subscription.price?.toNumber(),
      isActive: subscription.status === 'ACTIVE',
      isPaused: subscription.status === 'PAUSED',
      isCancelled: subscription.status === 'CANCELLED',
      daysUntilNextBilling: subscription.nextBillingDate 
        ? Math.ceil((new Date(subscription.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null,
      isOverdue: subscription.nextBillingDate 
        ? new Date(subscription.nextBillingDate) < new Date()
        : false,
    };
  }
}
