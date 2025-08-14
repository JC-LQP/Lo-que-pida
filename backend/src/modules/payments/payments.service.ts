import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto } from '../../common/dto/payments/payment.dto';
import { PaymentStatus, OrderStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: createPaymentDto.orderId },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const payment = await this.prisma.payment.create({
        data: createPaymentDto,
        include: {
          order: {
            include: {
              customer: {
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
          },
        },
      });

      return this.transformPayment(payment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            include: {
              customer: {
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
          },
        },
      }),
      this.prisma.payment.count(),
    ]);

    return {
      payments: payments.map(payment => this.transformPayment(payment)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
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
            orderItems: {
              include: {
                product: {
                  select: {
                    name: true,
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return this.transformPayment(payment);
  }

  async findByOrder(orderId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          select: {
            orderNumber: true,
            totalAmount: true,
          },
        },
      },
    });

    return payments.map(payment => this.transformPayment(payment));
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const existingPayment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    try {
      const payment = await this.prisma.payment.update({
        where: { id },
        data: {
          ...updatePaymentDto,
          paidAt: updatePaymentDto.status === PaymentStatus.PAID ? new Date() : existingPayment.paidAt,
        },
        include: {
          order: {
            include: {
              customer: {
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
          },
        },
      });

      return this.transformPayment(payment);
    } catch (error) {
      throw new Error(`Failed to update payment: ${error.message}`);
    }
  }

  async processPayment(id: string, transactionId: string, providerResponse?: any) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: true,
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException('Payment is already processed');
    }

    try {
      const updatedPayment = await this.prisma.payment.update({
        where: { id },
        data: {
          status: PaymentStatus.PAID,
          transactionId,
          providerResponse: providerResponse || null,
          paidAt: new Date(),
        },
      });

      // Update order status if needed
      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: OrderStatus.PROCESSING,
        },
      });

      return this.transformPayment(updatedPayment);
    } catch (error) {
      throw new Error(`Failed to process payment: ${error.message}`);
    }
  }

  async failPayment(id: string, failureReason: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    try {
      const updatedPayment = await this.prisma.payment.update({
        where: { id },
        data: {
          status: PaymentStatus.FAILED,
          failureReason,
        },
      });

      return this.transformPayment(updatedPayment);
    } catch (error) {
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  }

  async getPaymentStats() {
    const [
      totalPayments,
      paidPayments,
      pendingPayments,
      failedPayments,
      totalRevenue,
      recentPayments,
    ] = await Promise.all([
      this.prisma.payment.count(),
      this.prisma.payment.count({ where: { status: PaymentStatus.PAID } }),
      this.prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),
      this.prisma.payment.count({ where: { status: PaymentStatus.FAILED } }),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.PAID },
        _sum: { amount: true },
      }),
      this.prisma.payment.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      totalPayments,
      paidPayments,
      pendingPayments,
      failedPayments,
      totalRevenue: totalRevenue._sum?.amount?.toNumber() || 0,
      recentPayments,
      successRate: totalPayments > 0 ? ((paidPayments / totalPayments) * 100).toFixed(1) : '0',
      failureRate: totalPayments > 0 ? ((failedPayments / totalPayments) * 100).toFixed(1) : '0',
    };
  }

  private transformPayment(payment: any) {
    return {
      ...payment,
      amount: payment.amount?.toNumber(),
      formattedAmount: `${payment.currency || 'USD'} ${payment.amount?.toNumber() || 0}`,
      isPaid: payment.status === PaymentStatus.PAID,
      isPending: payment.status === PaymentStatus.PENDING,
      isFailed: payment.status === PaymentStatus.FAILED,
      daysSincePaid: payment.paidAt 
        ? Math.floor((Date.now() - new Date(payment.paidAt).getTime()) / (1000 * 60 * 60 * 24))
        : null,
    };
  }
}
