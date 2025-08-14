import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from '../../common/dto/warehouses/warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(private prisma: PrismaService) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    try {
      const warehouse = await this.prisma.warehouse.create({
        data: {
          ...createWarehouseDto,
          sellerId: 'default-seller-id', // Note: CreateWarehouseDto doesn't have sellerId field
        },
        include: {
          _count: {
            select: {
              inventory: true,
            },
          },
        },
      });

      return this.transformWarehouse(warehouse);
    } catch (error) {
      throw new Error(`Failed to create warehouse: ${error.message}`);
    }
  }

  async findAll(page: number = 1, limit: number = 10, location?: string, isActive?: boolean) {
    const skip = (page - 1) * limit;
    
    let where: any = {};
    
    if (location) {
      where.address = {
        contains: location,
        mode: 'insensitive',
      };
    }
    
    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    const [warehouses, total] = await Promise.all([
      this.prisma.warehouse.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              inventory: true,
            },
          },
        },
      }),
      this.prisma.warehouse.count({ where }),
    ]);

    return {
      warehouses: warehouses.map(warehouse => this.transformWarehouse(warehouse)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        inventory: {
          take: 5,
          orderBy: { updatedAt: 'desc' },
          include: {
            product: {
              select: {
                name: true,
                sku: true,
                images: true,
              },
            },
          },
        },
        // shippingInfos relation doesn't exist in schema
        _count: {
          select: {
            inventory: true,
          },
        },
      },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return this.transformWarehouse(warehouse);
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto) {
    const existingWarehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!existingWarehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    try {
      const warehouse = await this.prisma.warehouse.update({
        where: { id },
        data: updateWarehouseDto,
        include: {
          _count: {
            select: {
              inventory: true,
            },
          },
        },
      });

      return this.transformWarehouse(warehouse);
    } catch (error) {
      throw new Error(`Failed to update warehouse: ${error.message}`);
    }
  }

  async remove(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            inventory: true,
          },
        },
      },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    if (warehouse._count.inventory > 0) {
      // Soft delete by deactivating
      return this.update(id, { isActive: false });
    }

    try {
      await this.prisma.warehouse.delete({
        where: { id },
      });

      return { message: 'Warehouse deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete warehouse: ${error.message}`);
    }
  }

  async getWarehouseInventory(id: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      select: { name: true, address: true },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    const [inventory, total] = await Promise.all([
      this.prisma.inventory.findMany({
        skip,
        take: limit,
        where: { warehouseId: id },
        orderBy: { updatedAt: 'desc' },
        include: {
          product: {
            select: {
              name: true,
              sku: true,
              images: true,
              price: true,
            },
          },
        },
      }),
      this.prisma.inventory.count({ where: { warehouseId: id } }),
    ]);

    return {
      warehouse,
      inventory: inventory.map(item => ({
        ...item,
        product: {
          ...item.product,
          price: item.product.price?.toNumber(),
        },
        stockValue: item.product.price 
          ? (item.quantity * item.product.price.toNumber())
          : 0,
        isLowStock: item.quantity <= (item.reorderLevel || 10),
        isOutOfStock: item.quantity === 0,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getWarehouseStats(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      select: { name: true, address: true },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    const [
      totalProducts,
      totalItems,
      lowStockItems,
      outOfStockItems,
      totalShipments,
      recentShipments,
    ] = await Promise.all([
      this.prisma.inventory.count({ where: { warehouseId: id } }),
      this.prisma.inventory.aggregate({
        where: { warehouseId: id },
        _sum: { quantity: true },
      }),
      this.prisma.inventory.count({
        where: {
          warehouseId: id,
          quantity: { lte: 10 },
        },
      }),
      this.prisma.inventory.count({
        where: {
          warehouseId: id,
          quantity: 0,
        },
      }),
      0, // shippingInfos don't exist in schema
      0, // shippingInfos don't exist in schema
    ]);

    return {
      warehouse,
      totalProducts,
      totalItems: totalItems._sum.quantity || 0,
      lowStockItems,
      outOfStockItems,
      totalShipments,
      recentShipments,
    };
  }

  async findActiveWarehouses() {
    const warehouses = await this.prisma.warehouse.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        address: true,
        // capacity: true, // capacity field doesn't exist in Warehouse schema
      },
    });

    return warehouses;
  }

  async getWarehousesWithCapacity() {
    const warehouses = await this.prisma.warehouse.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            inventory: true,
          },
        },
        inventory: {
          select: {
            quantity: true,
          },
        },
      },
    });

    return warehouses.map(warehouse => ({
      ...warehouse,
      totalStock: warehouse.inventory.reduce((sum, inv) => sum + inv.quantity, 0),
      utilization: 0, // capacity field doesn't exist in schema
      availableCapacity: null, // capacity field doesn't exist in schema
    }));
  }

  private transformWarehouse(warehouse: any) {
    return {
      ...warehouse,
      utilization: null, // capacity field doesn't exist in schema
      availableCapacity: null, // capacity field doesn't exist in schema
      hasInventory: warehouse._count?.inventory > 0,
      hasActiveShipments: warehouse._count?.shippingInfos > 0,
    };
  }
}
