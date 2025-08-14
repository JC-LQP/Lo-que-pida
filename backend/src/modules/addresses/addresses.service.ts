import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from '../../common/dto/addresses/address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async create(createAddressDto: CreateAddressDto) {
    try {
      // Validate customer exists
      const customer = await this.prisma.customer.findUnique({
        where: { id: createAddressDto.customerId },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      // If this is set as default, unset other defaults for this customer
      if (createAddressDto.isDefault) {
        await this.prisma.address.updateMany({
          where: { customerId: createAddressDto.customerId },
          data: { isDefault: false },
        });
      }

      const address = await this.prisma.address.create({
        data: createAddressDto,
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
      });

      return address;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to create address: ${error.message}`);
    }
  }

  async findAll(customerId?: string) {
    const where = customerId ? { customerId } : {};

    const addresses = await this.prisma.address.findMany({
      where,
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
        shippingOrders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        billingOrders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return addresses.map(address => this.transformAddress(address));
  }

  async findOne(id: string) {
    const address = await this.prisma.address.findUnique({
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
        shippingOrders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        billingOrders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return this.transformAddress(address);
  }

  async findByCustomer(customerId: string) {
    const addresses = await this.prisma.address.findMany({
      where: { customerId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return addresses.map(address => this.transformAddress(address));
  }

  async getDefaultAddress(customerId: string) {
    const address = await this.prisma.address.findFirst({
      where: { 
        customerId,
        isDefault: true,
      },
    });

    if (!address) {
      return null;
    }

    return this.transformAddress(address);
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const existingAddress = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    try {
      // If setting as default, unset other defaults for this customer
      if (updateAddressDto.isDefault) {
        await this.prisma.address.updateMany({
          where: { 
            customerId: existingAddress.customerId,
            id: { not: id },
          },
          data: { isDefault: false },
        });
      }

      const address = await this.prisma.address.update({
        where: { id },
        data: updateAddressDto,
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
      });

      return this.transformAddress(address);
    } catch (error) {
      throw new Error(`Failed to update address: ${error.message}`);
    }
  }

  async setAsDefault(id: string) {
    const existingAddress = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    try {
      // Unset all defaults for this customer
      await this.prisma.address.updateMany({
        where: { customerId: existingAddress.customerId },
        data: { isDefault: false },
      });

      // Set this address as default
      const address = await this.prisma.address.update({
        where: { id },
        data: { isDefault: true },
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
      });

      return this.transformAddress(address);
    } catch (error) {
      throw new Error(`Failed to set address as default: ${error.message}`);
    }
  }

  async remove(id: string) {
    const existingAddress = await this.prisma.address.findUnique({
      where: { id },
      include: {
        shippingOrders: true,
        billingOrders: true,
      },
    });

    if (!existingAddress) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    // Check if address is being used in any orders
    if (existingAddress.shippingOrders.length > 0 || existingAddress.billingOrders.length > 0) {
      throw new BadRequestException('Cannot delete address that is associated with orders');
    }

    try {
      await this.prisma.address.delete({
        where: { id },
      });

      return { message: `Address with ID ${id} has been deleted` };
    } catch (error) {
      throw new Error(`Failed to delete address: ${error.message}`);
    }
  }

  async validateAddress(addressData: any) {
    // Basic validation - can be extended with address validation services
    const required = ['recipientName', 'streetAddress', 'city', 'province', 'country'];
    const missing = required.filter(field => !addressData[field]);
    
    if (missing.length > 0) {
      throw new BadRequestException(`Missing required fields: ${missing.join(', ')}`);
    }

    return true;
  }

  async getAddressStats(customerId?: string) {
    const where = customerId ? { customerId } : {};

    const [
      totalAddresses,
      defaultAddresses,
      shippingAddresses,
      billingAddresses,
      recentAddresses,
    ] = await Promise.all([
      this.prisma.address.count({ where }),
      this.prisma.address.count({ where: { ...where, isDefault: true } }),
      this.prisma.address.count({
        where: {
          ...where,
          shippingOrders: {
            some: {},
          },
        },
      }),
      this.prisma.address.count({
        where: {
          ...where,
          billingOrders: {
            some: {},
          },
        },
      }),
      this.prisma.address.count({
        where: {
          ...where,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    return {
      totalAddresses,
      defaultAddresses,
      shippingAddresses,
      billingAddresses,
      recentAddresses,
    };
  }

  private transformAddress(address: any) {
    return {
      ...address,
      fullAddress: this.formatFullAddress(address),
      isUsed: (address.shippingOrders?.length || 0) + (address.billingOrders?.length || 0) > 0,
      orderCount: (address.shippingOrders?.length || 0) + (address.billingOrders?.length || 0),
    };
  }

  private formatFullAddress(address: any): string {
    const parts = [
      address.streetAddress,
      address.city,
      address.province,
      address.country,
      address.postalCode,
    ].filter(Boolean);

    return parts.join(', ');
  }
}
