import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from '../../common/dto/customers/customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      // Validate user exists
      const user = await this.prisma.user.findUnique({
        where: { id: createCustomerDto.userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if customer profile already exists for this user
      const existingCustomer = await this.prisma.customer.findFirst({
        where: { userId: createCustomerDto.userId },
      });

      if (existingCustomer) {
        throw new BadRequestException('Customer profile already exists for this user');
      }

      const customer = await this.prisma.customer.create({
        data: createCustomerDto,
        include: {
          user: {
            select: {
              displayName: true,
              email: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
            },
          },
          addresses: {
            orderBy: { isDefault: 'desc' },
            take: 5,
          },
          orders: {
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
              id: true,
              orderNumber: true,
              status: true,
              totalAmount: true,
              createdAt: true,
            },
          },
        },
      });

      return this.transformCustomer(customer);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              displayName: true,
              email: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              isActive: true,
            },
          },
          _count: {
            select: {
              addresses: true,
              orders: true,
              carts: true,
              productReviews: true,
            },
          },
        },
      }),
      this.prisma.customer.count(),
    ]);

    return {
      customers: customers.map(customer => this.transformCustomer(customer)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            displayName: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            avatar: true,
            isActive: true,
            createdAt: true,
          },
        },
        addresses: {
          orderBy: [
            { isDefault: 'desc' },
            { createdAt: 'desc' },
          ],
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            orderItems: {
              select: {
                quantity: true,
                price: true,
                product: {
                  select: {
                    name: true,
                    images: true,
                  },
                },
              },
            },
          },
          take: 10,
        },
        carts: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    price: true,
                    images: true,
                  },
                },
              },
            },
          },
          take: 1,
          orderBy: { updatedAt: 'desc' },
        },
        productReviews: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return this.transformCustomer(customer);
  }

  async findByUserId(userId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { userId },
      include: {
        user: {
          select: {
            displayName: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            avatar: true,
          },
        },
        addresses: {
          orderBy: { isDefault: 'desc' },
        },
        _count: {
          select: {
            orders: true,
            productReviews: true,
          },
        },
      },
    });

    if (!customer) {
      return null;
    }

    return this.transformCustomer(customer);
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    try {
      const customer = await this.prisma.customer.update({
        where: { id },
        data: updateCustomerDto,
        include: {
          user: {
            select: {
              displayName: true,
              email: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              avatar: true,
            },
          },
        },
      });

      return this.transformCustomer(customer);
    } catch (error) {
      throw new Error(`Failed to update customer: ${error.message}`);
    }
  }

  async updateLoyaltyPoints(id: string, points: number, operation: 'add' | 'subtract' | 'set' = 'add') {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    let newPoints: number;

    switch (operation) {
      case 'add':
        newPoints = existingCustomer.loyaltyPoints + points;
        break;
      case 'subtract':
        newPoints = Math.max(0, existingCustomer.loyaltyPoints - points);
        break;
      case 'set':
        newPoints = Math.max(0, points);
        break;
      default:
        throw new BadRequestException('Invalid operation');
    }

    try {
      const customer = await this.prisma.customer.update({
        where: { id },
        data: { loyaltyPoints: newPoints },
        include: {
          user: {
            select: {
              displayName: true,
              email: true,
            },
          },
        },
      });

      return {
        ...this.transformCustomer(customer),
        pointsUpdated: {
          operation,
          pointsChanged: points,
          oldPoints: existingCustomer.loyaltyPoints,
          newPoints,
        },
      };
    } catch (error) {
      throw new Error(`Failed to update loyalty points: ${error.message}`);
    }
  }

  async remove(id: string) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: true,
        productReviews: true,
      },
    });

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    if (existingCustomer.orders.length > 0) {
      throw new BadRequestException('Cannot delete customer with existing orders');
    }

    try {
      // Delete reviews first
      await this.prisma.productReview.deleteMany({
        where: { customerId: id },
      });

      // Delete addresses
      await this.prisma.address.deleteMany({
        where: { customerId: id },
      });

      // Delete cart items and carts
      const carts = await this.prisma.cart.findMany({
        where: { customerId: id },
      });

      for (const cart of carts) {
        await this.prisma.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }

      await this.prisma.cart.deleteMany({
        where: { customerId: id },
      });

      // Delete customer
      await this.prisma.customer.delete({
        where: { id },
      });

      return { message: `Customer with ID ${id} has been deleted` };
    } catch (error) {
      throw new Error(`Failed to delete customer: ${error.message}`);
    }
  }

  async getCustomerStats() {
    const [
      totalCustomers,
      activeCustomers,
      customersWithOrders,
      customersWithReviews,
      averageLoyaltyPoints,
      topCustomersByPoints,
      recentCustomers,
    ] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.customer.count({
        where: {
          user: {
            isActive: true,
          },
        },
      }),
      this.prisma.customer.count({
        where: {
          orders: {
            some: {},
          },
        },
      }),
      this.prisma.customer.count({
        where: {
          productReviews: {
            some: {},
          },
        },
      }),
      this.prisma.customer.aggregate({
        _avg: {
          loyaltyPoints: true,
        },
      }),
      this.prisma.customer.findMany({
        orderBy: { loyaltyPoints: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              displayName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.customer.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      totalCustomers,
      activeCustomers,
      customersWithOrders,
      customersWithReviews,
      averageLoyaltyPoints: Math.round(averageLoyaltyPoints._avg.loyaltyPoints || 0),
      topCustomersByPoints: topCustomersByPoints.map(customer => this.transformCustomer(customer)),
      recentCustomers,
      engagementRate: totalCustomers > 0 ? ((customersWithOrders / totalCustomers) * 100).toFixed(1) : '0',
      reviewRate: totalCustomers > 0 ? ((customersWithReviews / totalCustomers) * 100).toFixed(1) : '0',
    };
  }

  async getCustomerActivity(customerId: string) {
    const [orders, reviews, addresses, carts] = await Promise.all([
      this.prisma.order.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalAmount: true,
          createdAt: true,
        },
      }),
      this.prisma.productReview.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          product: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.address.count({
        where: { customerId },
      }),
      this.prisma.cart.findMany({
        where: { customerId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        include: {
          _count: {
            select: {
              items: true,
            },
          },
        },
      }),
    ]);

    return {
      recentOrders: orders,
      recentReviews: reviews,
      addressesCount: addresses,
      recentCarts: carts,
    };
  }

  private transformCustomer(customer: any) {
    return {
      ...customer,
      fullName: this.getCustomerDisplayName(customer),
      totalOrders: customer._count?.orders || customer.orders?.length || 0,
      totalReviews: customer._count?.productReviews || customer.productReviews?.length || 0,
      totalAddresses: customer._count?.addresses || customer.addresses?.length || 0,
      loyaltyTier: this.getLoyaltyTier(customer.loyaltyPoints || 0),
      membershipDays: customer.createdAt ? Math.floor((Date.now() - new Date(customer.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0,
    };
  }

  private getCustomerDisplayName(customer: any): string {
    if (customer?.user?.displayName) {
      return customer.user.displayName;
    }
    if (customer?.user?.firstName && customer?.user?.lastName) {
      return `${customer.user.firstName} ${customer.user.lastName}`;
    }
    return customer?.user?.firstName || customer?.user?.email || 'Customer';
  }

  private getLoyaltyTier(points: number): string {
    if (points >= 10000) return 'Platinum';
    if (points >= 5000) return 'Gold';
    if (points >= 1000) return 'Silver';
    return 'Bronze';
  }
}
