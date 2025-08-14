import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  ProductFilterDto, 
  BulkUpdateProductsDto 
} from '../../common/dto/products/product.dto';
import { ProductCondition, UserRole } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, sellerId?: string) {
    try {
      // Validate seller exists
      const seller = await this.prisma.seller.findUnique({
        where: { id: sellerId || createProductDto.sellerId },
      });

      if (!seller) {
        throw new NotFoundException('Seller not found');
      }

      // Validate category exists
      const category = await this.prisma.category.findUnique({
        where: { id: createProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      // Check if SKU already exists
      const existingProduct = await this.prisma.product.findUnique({
        where: { sku: createProductDto.sku },
      });

      if (existingProduct) {
        throw new BadRequestException('Product with this SKU already exists');
      }

      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          sellerId: sellerId || createProductDto.sellerId,
        },
        include: {
          category: true,
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
          inventory: true,
          productReviews: {
            include: {
              customer: {
                include: {
                  user: {
                    select: {
                      displayName: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      return this.transformProduct(product);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async findAll(filters?: ProductFilterDto, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const where: any = {
      isActive: true, // Only show active products by default
    };

    // Apply filters
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { brand: { contains: filters.search, mode: 'insensitive' } },
        { tags: { has: filters.search } },
      ];
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.sellerId) {
      where.sellerId = filters.sellerId;
    }

    if (filters?.condition) {
      where.condition = filters.condition;
    }

    if (filters?.brand) {
      where.brand = { contains: filters.brand, mode: 'insensitive' };
    }

    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }

    if (filters?.inStock) {
      where.inventory = {
        some: {
          quantity: { gt: 0 },
        },
      };
    }

    if (filters?.onSale) {
      where.comparePrice = { gt: where.price || 0 };
    }

    if (filters?.featured) {
      where.isFeatured = true;
    }

    if (filters?.tags && filters.tags.length > 0) {
      where.tags = {
        hasEvery: filters.tags,
      };
    }

    const orderBy: any = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder?.toLowerCase() || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
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
          inventory: true,
          productReviews: {
            include: {
              customer: {
                include: {
                  user: {
                    select: {
                      displayName: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map(product => this.transformProduct(product)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          include: {
            parent: true,
          },
        },
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
        inventory: {
          include: {
            warehouse: true,
          },
        },
        productReviews: {
          include: {
            customer: {
              include: {
                user: {
                  select: {
                    displayName: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.transformProduct(product);
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          include: {
            parent: true,
          },
        },
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
        inventory: {
          include: {
            warehouse: true,
          },
        },
        productReviews: {
          include: {
            customer: {
              include: {
                user: {
                  select: {
                    displayName: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return this.transformProduct(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto, userRole: UserRole, sellerId?: string) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      include: { seller: true },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Check permissions
    if (userRole !== UserRole.ADMIN && existingProduct.sellerId !== sellerId) {
      throw new ForbiddenException('You can only update your own products');
    }

    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        include: {
          category: true,
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
          inventory: true,
          productReviews: {
            include: {
              customer: {
                include: {
                  user: {
                    select: {
                      displayName: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      return this.transformProduct(product);
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  async remove(id: string, userRole: UserRole, sellerId?: string) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      include: { seller: true },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Check permissions
    if (userRole !== UserRole.ADMIN && existingProduct.sellerId !== sellerId) {
      throw new ForbiddenException('You can only delete your own products');
    }

    try {
      await this.prisma.product.delete({
        where: { id },
      });

      return { message: `Product with ID ${id} has been deleted` };
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  async bulkUpdate(bulkUpdateDto: BulkUpdateProductsDto, userRole: UserRole, sellerId?: string) {
    // If not admin, validate that all products belong to the seller
    if (userRole !== UserRole.ADMIN && sellerId) {
      const products = await this.prisma.product.findMany({
        where: {
          id: { in: bulkUpdateDto.productIds },
        },
        select: { id: true, sellerId: true },
      });

      const unauthorizedProducts = products.filter(p => p.sellerId !== sellerId);
      if (unauthorizedProducts.length > 0) {
        throw new ForbiddenException('You can only update your own products');
      }
    }

    const updateData: any = {};
    if (bulkUpdateDto.categoryId) updateData.categoryId = bulkUpdateDto.categoryId;
    if (bulkUpdateDto.isActive !== undefined) updateData.isActive = bulkUpdateDto.isActive;
    if (bulkUpdateDto.isFeatured !== undefined) updateData.isFeatured = bulkUpdateDto.isFeatured;
    if (bulkUpdateDto.tags) updateData.tags = bulkUpdateDto.tags;

    try {
      const result = await this.prisma.product.updateMany({
        where: {
          id: { in: bulkUpdateDto.productIds },
        },
        data: updateData,
      });

      return {
        message: `Successfully updated ${result.count} products`,
        updatedCount: result.count,
      };
    } catch (error) {
      throw new Error(`Failed to bulk update products: ${error.message}`);
    }
  }

  async getSellerProducts(sellerId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { sellerId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          inventory: true,
          productReviews: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      this.prisma.product.count({ where: { sellerId } }),
    ]);

    return {
      products: products.map(product => this.transformProduct(product)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getFeaturedProducts(limit: number = 12) {
    const products = await this.prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
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
        inventory: true,
        productReviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return products.map(product => this.transformProduct(product));
  }

  async getProductStats(sellerId?: string) {
    const where = sellerId ? { sellerId } : {};

    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      featuredProducts,
      outOfStockProducts,
      lowStockProducts,
      averagePrice,
      totalInventory,
    ] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.count({ where: { ...where, isActive: true } }),
      this.prisma.product.count({ where: { ...where, isActive: false } }),
      this.prisma.product.count({ where: { ...where, isFeatured: true } }),
      this.prisma.product.count({
        where: {
          ...where,
          inventory: {
            every: {
              quantity: 0,
            },
          },
        },
      }),
      this.prisma.product.count({
        where: {
          ...where,
          inventory: {
            some: {
              quantity: {
                lte: 10,
                gt: 0,
              },
            },
          },
        },
      }),
      this.prisma.product.aggregate({
        where,
        _avg: {
          price: true,
        },
      }),
      this.prisma.inventory.aggregate({
        where: sellerId ? {
          product: {
            sellerId,
          },
        } : {},
        _sum: {
          quantity: true,
        },
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      featuredProducts,
      outOfStockProducts,
      lowStockProducts,
      averagePrice: averagePrice._avg.price?.toNumber() || 0,
      totalInventory: totalInventory._sum.quantity || 0,
      activeRate: totalProducts > 0 ? ((activeProducts / totalProducts) * 100).toFixed(1) : '0',
      featuredRate: totalProducts > 0 ? ((featuredProducts / totalProducts) * 100).toFixed(1) : '0',
    };
  }

  private transformProduct(product: any) {
    const totalStock = product.inventory?.reduce((sum: number, inv: any) => sum + inv.quantity, 0) || 0;
    const averageRating = product.productReviews?.length > 0 
      ? product.productReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.productReviews.length 
      : 0;

    return {
      ...product,
      stock: totalStock,
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount: product.productReviews?.length || 0,
      isInStock: totalStock > 0,
      isOnSale: product.comparePrice && product.comparePrice > product.price,
      discountPercentage: product.comparePrice && product.comparePrice > product.price
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0,
      price: product.price.toNumber(),
      comparePrice: product.comparePrice?.toNumber(),
      costPrice: product.costPrice?.toNumber(),
    };
  }
}
