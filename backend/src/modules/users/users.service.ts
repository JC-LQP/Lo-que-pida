import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupabaseUserDto, UpdateSupabaseUserDto, UserFilterDto } from '../../common/dto/users/user.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateSupabaseUserDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email }
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const user = await this.prisma.user.create({
        data: {
          firebaseUid: createUserDto.firebaseUid,
          email: createUserDto.email,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          displayName: createUserDto.displayName,
          avatar: createUserDto.avatar,
          phoneNumber: createUserDto.phoneNumber,
          role: createUserDto.role as any, // Cast enum to avoid type mismatch
          emailVerified: createUserDto.emailVerified || false,
        },
        include: {
          customers: true,
          sellers: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findAll(filters?: UserFilterDto, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const where: any = {};

    if (filters?.role) {
      where.role = filters.role;
    }

    if (filters?.emailVerified !== undefined) {
      where.emailVerified = filters.emailVerified;
    }

    if (filters?.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { displayName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [filters?.sortBy || 'createdAt']: filters?.sortOrder?.toLowerCase() || 'desc'
        },
        include: {
          customers: true,
          sellers: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        customers: {
          include: {
            addresses: true,
            orders: {
              include: {
                orderItems: {
                  include: {
                    product: true,
                  },
                },
              },
              take: 5,
              orderBy: { createdAt: 'desc' },
            },
          },
        },
        sellers: {
          include: {
            products: {
              take: 5,
              orderBy: { createdAt: 'desc' },
            },
            warehouses: true,
            subscriptions: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByFirebaseUid(firebaseUid: string) {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        customers: true,
        sellers: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with Firebase UID ${firebaseUid} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        customers: true,
        sellers: true,
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateSupabaseUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          firstName: updateUserDto.firstName,
          lastName: updateUserDto.lastName,
          displayName: updateUserDto.displayName,
          avatar: updateUserDto.avatar,
          phoneNumber: updateUserDto.phoneNumber,
          role: updateUserDto.role as any, // Cast enum to avoid type mismatch
          emailVerified: updateUserDto.emailVerified,
        },
        include: {
          customers: true,
          sellers: true,
        },
      });

      return user;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async remove(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      await this.prisma.user.delete({
        where: { id },
      });

      return { message: `User with ID ${id} has been deleted` };
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async getUserStats() {
    const [
      totalUsers,
      customersCount,
      sellersCount,
      adminsCount,
      verifiedUsers,
      activeUsers,
      recentUsers,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
      this.prisma.user.count({ where: { role: UserRole.SELLER } }),
      this.prisma.user.count({ where: { role: UserRole.ADMIN } }),
      this.prisma.user.count({ where: { emailVerified: true } }),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    return {
      totalUsers,
      customersCount,
      sellersCount,
      adminsCount,
      verifiedUsers,
      activeUsers,
      recentUsers,
      verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers * 100).toFixed(1) : '0',
      activeRate: totalUsers > 0 ? (activeUsers / totalUsers * 100).toFixed(1) : '0',
    };
  }
}
