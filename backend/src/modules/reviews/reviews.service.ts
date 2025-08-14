import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from '../../common/dto/reviews/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      // Validate customer exists
      const customer = await this.prisma.customer.findUnique({
        where: { id: createReviewDto.customerId },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      // Validate product exists
      const product = await this.prisma.product.findUnique({
        where: { id: createReviewDto.productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Check if customer has already reviewed this product
      const existingReview = await this.prisma.productReview.findFirst({
        where: {
          customerId: createReviewDto.customerId,
          productId: createReviewDto.productId,
        },
      });

      if (existingReview) {
        throw new BadRequestException('You have already reviewed this product');
      }

      // Check if customer has purchased this product (for verified purchase)
      const hasPurchased = await this.prisma.orderItem.findFirst({
        where: {
          productId: createReviewDto.productId,
          order: {
            customerId: createReviewDto.customerId,
            status: {
              in: ['DELIVERED', 'SHIPPED'],
            },
          },
        },
      });

      const review = await this.prisma.productReview.create({
        data: {
          isVerifiedPurchase: !!hasPurchased,
          productId: createReviewDto.productId,
          customerId: createReviewDto.customerId,
          // orderId field doesn't exist in ProductReview schema
          rating: createReviewDto.rating,
          title: createReviewDto.title,
          comment: createReviewDto.comment,
          images: createReviewDto.images ? createReviewDto.images.split(',').map(img => img.trim()) : [],
        },
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
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
            },
          },
        },
      });

      return this.transformReview(review);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to create review: ${error.message}`);
    }
  }

  async findAll(filters?: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const where: any = {};

    if (filters?.productId) {
      where.productId = filters.productId;
    }

    if (filters?.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters?.rating) {
      where.rating = parseInt(filters.rating);
    }

    if (filters?.isApproved !== undefined) {
      where.isApproved = filters.isApproved === 'true';
    }

    if (filters?.isVerifiedPurchase !== undefined) {
      where.isVerifiedPurchase = filters.isVerifiedPurchase === 'true';
    }

    const [reviews, total] = await Promise.all([
      this.prisma.productReview.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
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
      }),
      this.prisma.productReview.count({ where }),
    ]);

    return {
      reviews: reviews.map(review => this.transformReview(review)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const review = await this.prisma.productReview.findUnique({
      where: { id },
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
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return this.transformReview(review);
  }

  async findByProduct(productId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total, stats] = await Promise.all([
      this.prisma.productReview.findMany({
        where: { 
          productId,
          isApproved: true, // Only show approved reviews
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
      this.prisma.productReview.count({ 
        where: { 
          productId,
          isApproved: true,
        },
      }),
      this.getProductReviewStats(productId),
    ]);

    return {
      reviews: reviews.map(review => this.transformReview(review)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats,
    };
  }

  async findByCustomer(customerId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.productReview.findMany({
        where: { customerId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
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
      }),
      this.prisma.productReview.count({ where: { customerId } }),
    ]);

    return {
      reviews: reviews.map(review => this.transformReview(review)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, customerId?: string) {
    const existingReview = await this.prisma.productReview.findUnique({
      where: { id },
    });

    if (!existingReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Only allow the review author to update their review
    if (customerId && existingReview.customerId !== customerId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    try {
      const review = await this.prisma.productReview.update({
        where: { id },
        data: {
          isApproved: false, // Reset approval status when updated
          rating: updateReviewDto.rating,
          title: updateReviewDto.title,
          comment: updateReviewDto.comment,
          images: updateReviewDto.images ? updateReviewDto.images.split(',').map(img => img.trim()) : undefined,
        },
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
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
            },
          },
        },
      });

      return this.transformReview(review);
    } catch (error) {
      throw new Error(`Failed to update review: ${error.message}`);
    }
  }

  async approve(id: string) {
    const existingReview = await this.prisma.productReview.findUnique({
      where: { id },
    });

    if (!existingReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    try {
      const review = await this.prisma.productReview.update({
        where: { id },
        data: { isApproved: true },
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
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
            },
          },
        },
      });

      return this.transformReview(review);
    } catch (error) {
      throw new Error(`Failed to approve review: ${error.message}`);
    }
  }

  async remove(id: string, customerId?: string) {
    const existingReview = await this.prisma.productReview.findUnique({
      where: { id },
    });

    if (!existingReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Only allow the review author to delete their review (or admin)
    if (customerId && existingReview.customerId !== customerId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    try {
      await this.prisma.productReview.delete({
        where: { id },
      });

      return { message: `Review with ID ${id} has been deleted` };
    } catch (error) {
      throw new Error(`Failed to delete review: ${error.message}`);
    }
  }

  async getProductReviewStats(productId: string) {
    const [
      totalReviews,
      averageRating,
      ratingDistribution,
      verifiedPurchaseCount,
    ] = await Promise.all([
      this.prisma.productReview.count({
        where: { productId, isApproved: true },
      }),
      this.prisma.productReview.aggregate({
        where: { productId, isApproved: true },
        _avg: { rating: true },
      }),
      this.prisma.productReview.groupBy({
        by: ['rating'],
        where: { productId, isApproved: true },
        _count: { rating: true },
      }),
      this.prisma.productReview.count({
        where: { 
          productId, 
          isApproved: true,
          isVerifiedPurchase: true,
        },
      }),
    ]);

    // Create distribution object
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistribution.forEach(item => {
      distribution[item.rating] = item._count.rating;
    });

    return {
      totalReviews,
      averageRating: averageRating._avg.rating ? Number(averageRating._avg.rating.toFixed(1)) : 0,
      ratingDistribution: distribution,
      verifiedPurchaseCount,
      verifiedPurchaseRate: totalReviews > 0 ? (verifiedPurchaseCount / totalReviews * 100).toFixed(1) : '0',
    };
  }

  async getPendingReviews(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.productReview.findMany({
        where: { isApproved: false },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
            },
          },
        },
      }),
      this.prisma.productReview.count({ where: { isApproved: false } }),
    ]);

    return {
      reviews: reviews.map(review => this.transformReview(review)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private transformReview(review: any) {
    return {
      ...review,
      customerName: this.getCustomerDisplayName(review.customer),
      canEdit: true, // This would be determined by business logic
      daysAgo: Math.floor((Date.now() - new Date(review.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
    };
  }

  private getCustomerDisplayName(customer: any): string {
    if (customer?.user?.displayName) {
      return customer.user.displayName;
    }
    if (customer?.user?.firstName && customer?.user?.lastName) {
      return `${customer.user.firstName} ${customer.user.lastName}`;
    }
    return customer?.user?.firstName || 'Anonymous Customer';
  }
}
