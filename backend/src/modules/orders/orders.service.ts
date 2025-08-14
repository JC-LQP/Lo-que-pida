import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { 
  CreateOrderDto, 
  UpdateOrderDto, 
  OrderFilterDto,
  UpdateOrderStatusDto
} from '../../common/dto/orders/order.dto';
import { UserRole, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      // Validate customer exists
      const customer = await this.prisma.customer.findUnique({
        where: { id: createOrderDto.customerId },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      // Validate addresses
      const shippingAddress = await this.prisma.address.findUnique({
        where: { id: createOrderDto.shippingAddressId },
      });

      if (!shippingAddress) {
        throw new NotFoundException('Shipping address not found');
      }

      if (createOrderDto.billingAddressId) {
        const billingAddress = await this.prisma.address.findUnique({
          where: { id: createOrderDto.billingAddressId },
        });

        if (!billingAddress) {
          throw new NotFoundException('Billing address not found');
        }
      }

      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      // Calculate totals
      let subtotal = 0;
      if (createOrderDto.items && createOrderDto.items.length > 0) {
        subtotal = createOrderDto.items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        );
      } else if (createOrderDto.cartId) {
        // Calculate from cart
        const cart = await this.prisma.cart.findUnique({
          where: { id: createOrderDto.cartId },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        if (!cart) {
          throw new NotFoundException('Cart not found');
        }

        subtotal = cart.items.reduce(
          (sum, item) => sum + (item.price.toNumber() * item.quantity), 0
        );
      }

      const shippingCost = 0; // Calculate based on shipping rules
      const taxAmount = subtotal * 0.1; // 10% tax rate - should be configurable
      const totalAmount = subtotal + shippingCost + taxAmount;

      const order = await this.prisma.order.create({
        data: {
          orderNumber,
          customerId: createOrderDto.customerId,
          status: 'PENDING',
          subtotal,
          shippingCost,
          taxAmount,
          totalAmount,
          shippingAddressId: createOrderDto.shippingAddressId,
          billingAddressId: createOrderDto.billingAddressId,
          notes: createOrderDto.notes,
        },
        include: {
          customer: {
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
          shippingAddress: true,
          billingAddress: true,
          orderItems: {
            include: {
              product: {
                include: {
                  category: true,
                  seller: {
                    include: {
                      user: {
                        select: {
                          displayName: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          payments: true,
        },
      });

      // Create order items
      if (createOrderDto.items && createOrderDto.items.length > 0) {
        await Promise.all(
          createOrderDto.items.map(item =>
            this.prisma.orderItem.create({
              data: {
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              },
            })
          )
        );
      } else if (createOrderDto.cartId) {
        const cartItems = await this.prisma.cartItem.findMany({
          where: { cartId: createOrderDto.cartId },
        });

        await Promise.all(
          cartItems.map(item =>
            this.prisma.orderItem.create({
              data: {
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price.toNumber(),
              },
            })
          )
        );

        // Clear cart after creating order
        await this.prisma.cartItem.deleteMany({
          where: { cartId: createOrderDto.cartId },
        });
      }

      return this.transformOrder(order);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  async findAll(filters?: OrderFilterDto, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters?.orderNumber) {
      where.orderNumber = { contains: filters.orderNumber, mode: 'insensitive' };
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.createdAt.lte = new Date(filters.dateTo);
    }

    if (filters?.minAmount || filters?.maxAmount) {
      where.totalAmount = {};
      if (filters.minAmount) where.totalAmount.gte = filters.minAmount;
      if (filters.maxAmount) where.totalAmount.lte = filters.maxAmount;
    }

    if (filters?.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { customer: { 
          user: { 
            email: { contains: filters.search, mode: 'insensitive' } 
          } 
        }},
        { notes: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder?.toLowerCase() || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          customer: {
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
          shippingAddress: true,
          billingAddress: true,
          orderItems: {
            include: {
              product: {
                include: {
                  category: true,
                  seller: {
                    include: {
                      user: {
                        select: {
                          displayName: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          payments: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map(order => this.transformOrder(order)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userRole?: UserRole, customerId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
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
        shippingAddress: true,
        billingAddress: true,
        orderItems: {
          include: {
            product: {
              include: {
                category: true,
                seller: {
                  include: {
                    user: {
                      select: {
                        displayName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        payments: true,
        shippingInfo: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Check permissions
    if (userRole === UserRole.CUSTOMER && order.customerId !== customerId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    return this.transformOrder(order);
  }

  async updateStatus(
    id: string, 
    updateStatusDto: UpdateOrderStatusDto, 
    userRole: UserRole
  ) {
    if (userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update order status');
    }

    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const updateData: any = {
      status: updateStatusDto.status,
    };

    if (updateStatusDto.trackingNumber) {
      updateData.trackingNumber = updateStatusDto.trackingNumber;
    }

    if ((updateStatusDto.status as any) === 'SHIPPED') {
      updateData.shippedAt = new Date();
    }

    if ((updateStatusDto.status as any) === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    }

    if ((updateStatusDto.status as any) === 'CANCELLED') {
      updateData.cancellationReason = updateStatusDto.reason;
    }

    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          customer: {
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
          shippingAddress: true,
          billingAddress: true,
          orderItems: {
            include: {
              product: {
                include: {
                  category: true,
                  seller: {
                    include: {
                      user: {
                        select: {
                          displayName: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          payments: true,
        },
      });

      return this.transformOrder(updatedOrder);
    } catch (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }

  async getCustomerOrders(customerId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { customerId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            include: {
              product: {
                include: {
                  category: true,
                  seller: {
                    include: {
                      user: {
                        select: {
                          displayName: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          shippingAddress: true,
          payments: true,
        },
      }),
      this.prisma.order.count({ where: { customerId } }),
    ]);

    return {
      orders: orders.map(order => this.transformOrder(order)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrderStats() {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      ordersToday,
      ordersThisWeek,
      ordersThisMonth,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.order.count({ where: { status: 'PROCESSING' } }),
      this.prisma.order.count({ where: { status: 'SHIPPED' } }),
      this.prisma.order.count({ where: { status: 'DELIVERED' } }),
      this.prisma.order.count({ where: { status: 'CANCELLED' } }),
      this.prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: {
            in: ['DELIVERED', 'SHIPPED'],
          },
        },
      }),
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    const averageOrderValue = totalOrders > 0 
      ? (totalRevenue._sum.totalAmount?.toNumber() || 0) / totalOrders 
      : 0;

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue._sum.totalAmount?.toNumber() || 0,
      averageOrderValue,
      ordersToday,
      ordersThisWeek,
      ordersThisMonth,
    };
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const prefix = `ORD-${year}${month}${day}`;
    
    const lastOrder = await this.prisma.order.findFirst({
      where: {
        orderNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        orderNumber: 'desc',
      },
    });

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.split('-').pop() || '0');
      sequence = lastSequence + 1;
    }

    return `${prefix}-${String(sequence).padStart(4, '0')}`;
  }

  private transformOrder(order: any) {
    return {
      ...order,
      subtotal: order.subtotal.toNumber(),
      shippingCost: order.shippingCost.toNumber(),
      taxAmount: order.taxAmount.toNumber(),
      totalAmount: order.totalAmount.toNumber(),
      itemCount: order.orderItems?.length || 0,
      canCancel: order.status === 'PENDING' || order.status === 'PROCESSING',
      canReturn: order.status === 'DELIVERED',
      orderItems: order.orderItems?.map((item: any) => ({
        ...item,
        price: item.price.toNumber(),
        totalPrice: item.price.toNumber() * item.quantity,
      })),
    };
  }
}
