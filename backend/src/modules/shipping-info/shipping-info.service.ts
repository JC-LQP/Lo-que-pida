import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateShippingInfoDto, UpdateShippingInfoDto } from '../../common/dto/shipping-info/shipping-info.dto';

@Injectable()
export class ShippingInfoService {
  constructor(private prisma: PrismaService) {}

  async create(createShippingInfoDto: CreateShippingInfoDto) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: createShippingInfoDto.orderId },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // Note: ShippingInfo model doesn't have warehouseId field in schema
      const shippingInfo = await this.prisma.shippingInfo.create({
        data: {
          orderId: createShippingInfoDto.orderId,
          carrier: createShippingInfoDto.carrier,
          trackingNumber: createShippingInfoDto.trackingNumber,
          // shippingMethod field doesn't exist in DTO or schema
          estimatedDelivery: createShippingInfoDto.estimatedDeliveryDate ? new Date(createShippingInfoDto.estimatedDeliveryDate) : null,
          shippingCost: createShippingInfoDto.shippingCost || 0,
          weight: createShippingInfoDto.weight,
          dimensions: createShippingInfoDto.dimensions,
        },
        include: {
          order: {
            select: {
              orderNumber: true,
              totalAmount: true,
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

      return this.transformShippingInfo(shippingInfo);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to create shipping info: ${error.message}`);
    }
  }

  async findAll(page: number = 1, limit: number = 10, status?: string) {
    const skip = (page - 1) * limit;
    
    let where: any = {};
    
    // Note: ShippingInfo model doesn't have status field

    const [shippingInfos, total] = await Promise.all([
      this.prisma.shippingInfo.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              orderNumber: true,
              totalAmount: true,
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
          // Note: ShippingInfo model doesn't have warehouse relation
        },
      }),
      this.prisma.shippingInfo.count({ where }),
    ]);

    return {
      shippingInfos: shippingInfos.map(info => this.transformShippingInfo(info)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const shippingInfo = await this.prisma.shippingInfo.findUnique({
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
                addresses: {
                  where: { isDefault: true },
                  take: 1,
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
        // Note: ShippingInfo model doesn't have warehouse relation
      },
    });

    if (!shippingInfo) {
      throw new NotFoundException(`Shipping info with ID ${id} not found`);
    }

    return this.transformShippingInfo(shippingInfo);
  }

  async findByOrder(orderId: string) {
    const shippingInfos = await this.prisma.shippingInfo.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
      // Note: ShippingInfo model doesn't have warehouse relation
    });

    return shippingInfos.map(info => this.transformShippingInfo(info));
  }

  async findByTrackingNumber(trackingNumber: string) {
    const shippingInfo = await this.prisma.shippingInfo.findFirst({
      where: { trackingNumber },
      include: {
        order: {
          select: {
            orderNumber: true,
            totalAmount: true,
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
        // Note: ShippingInfo model doesn't have warehouse relation
      },
    });

    if (!shippingInfo) {
      throw new NotFoundException(`Shipping info with tracking number ${trackingNumber} not found`);
    }

    return this.transformShippingInfo(shippingInfo);
  }

  async update(id: string, updateShippingInfoDto: UpdateShippingInfoDto) {
    const existingShippingInfo = await this.prisma.shippingInfo.findUnique({
      where: { id },
    });

    if (!existingShippingInfo) {
      throw new NotFoundException(`Shipping info with ID ${id} not found`);
    }

    try {
      let updateData: any = { ...updateShippingInfoDto };

      // Note: ShippingInfo model doesn't have status field, so can't check status changes
      // Also, shippedAt and deliveredAt fields don't exist - only actualDelivery exists

      const shippingInfo = await this.prisma.shippingInfo.update({
        where: { id },
        data: updateData,
        include: {
          order: {
            select: {
              orderNumber: true,
              totalAmount: true,
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
          // Note: ShippingInfo model doesn't have warehouse relation
        },
      });

      // Note: Would update order status if shipping status tracking was available

      return this.transformShippingInfo(shippingInfo);
    } catch (error) {
      throw new Error(`Failed to update shipping info: ${error.message}`);
    }
  }

  // Note: updateStatus method removed because ShippingInfo model doesn't have status field

  async getShippingStats() {
    const [
      totalShipments,
      recentShipments,
    ] = await Promise.all([
      this.prisma.shippingInfo.count(),
      this.prisma.shippingInfo.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      totalShipments,
      recentShipments,
      // Note: Status-based stats removed because ShippingInfo model doesn't have status field
    };
  }

  private transformShippingInfo(shippingInfo: any) {
    return {
      ...shippingInfo,
      shippingCost: shippingInfo.shippingCost?.toNumber(),
      weight: shippingInfo.weight?.toNumber(),
      // Note: Status-based flags removed because ShippingInfo model doesn't have status field
      estimatedDeliveryDays: shippingInfo.estimatedDelivery 
        ? Math.ceil((new Date(shippingInfo.estimatedDelivery).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null,
      actualDeliveryDays: shippingInfo.actualDelivery 
        ? Math.floor((Date.now() - new Date(shippingInfo.actualDelivery).getTime()) / (1000 * 60 * 60 * 24))
        : null,
    };
  }
}
