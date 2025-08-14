import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSellerDto, UpdateSellerDto } from '../../common/dto/sellers/seller.dto';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async create(createSellerDto: CreateSellerDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: createSellerDto.userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const existingSeller = await this.prisma.seller.findFirst({
        where: { userId: createSellerDto.userId },
      });

      if (existingSeller) {
        throw new BadRequestException('Seller profile already exists for this user');
      }

      const seller = await this.prisma.seller.create({
        data: {
          ...createSellerDto,
          status: createSellerDto.status as any, // Cast enum to avoid type mismatch
        },
        include: {
          user: {
            select: {
              displayName: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          products: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          warehouses: true,
        },
      });

      return seller;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to create seller: ${error.message}`);
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [sellers, total] = await Promise.all([
      this.prisma.seller.findMany({
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
            },
          },
          _count: {
            select: {
              products: true,
              warehouses: true,
            },
          },
        },
      }),
      this.prisma.seller.count(),
    ]);

    return {
      sellers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const seller = await this.prisma.seller.findUnique({
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
          },
        },
        products: {
          orderBy: { createdAt: 'desc' },
          include: {
            category: true,
            inventory: true,
          },
        },
        warehouses: {
          include: {
            inventory: {
              include: {
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        subscriptions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }

    return seller;
  }

  async findByUserId(userId: string) {
    const seller = await this.prisma.seller.findFirst({
      where: { userId },
      include: {
        user: {
          select: {
            displayName: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            products: true,
            warehouses: true,
          },
        },
      },
    });

    return seller;
  }

  async update(id: string, updateSellerDto: UpdateSellerDto) {
    const existingSeller = await this.prisma.seller.findUnique({
      where: { id },
    });

    if (!existingSeller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }

    try {
      const seller = await this.prisma.seller.update({
        where: { id },
        data: {
          ...updateSellerDto,
          status: updateSellerDto.status as any, // Cast enum to avoid type mismatch
        },
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
      });

      return seller;
    } catch (error) {
      throw new Error(`Failed to update seller: ${error.message}`);
    }
  }

  async remove(id: string) {
    const existingSeller = await this.prisma.seller.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!existingSeller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }

    if (existingSeller.products.length > 0) {
      throw new BadRequestException('Cannot delete seller with existing products');
    }

    try {
      await this.prisma.seller.delete({
        where: { id },
      });

      return { message: `Seller with ID ${id} has been deleted` };
    } catch (error) {
      throw new Error(`Failed to delete seller: ${error.message}`);
    }
  }

  async getSellerStats() {
    const [totalSellers, activeSellers, sellersWithProducts] = await Promise.all([
      this.prisma.seller.count(),
      this.prisma.seller.count({ where: { status: 'ACTIVE' } }),
      this.prisma.seller.count({
        where: {
          products: {
            some: {},
          },
        },
      }),
    ]);

    return {
      totalSellers,
      activeSellers,
      sellersWithProducts,
    };
  }
}
