import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInventoryDto, UpdateInventoryDto } from '../../common/dto/inventory/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async create(createInventoryDto: CreateInventoryDto) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: createInventoryDto.productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const warehouse = await this.prisma.warehouse.findUnique({
        where: { id: createInventoryDto.warehouseId },
      });

      if (!warehouse) {
        throw new NotFoundException('Warehouse not found');
      }

      // Check if inventory already exists for this product-warehouse combination
      const existingInventory = await this.prisma.inventory.findFirst({
        where: {
          productId: createInventoryDto.productId,
          warehouseId: createInventoryDto.warehouseId,
        },
      });

      if (existingInventory) {
        throw new BadRequestException('Inventory already exists for this product in this warehouse');
      }

      const inventory = await this.prisma.inventory.create({
        data: createInventoryDto,
        include: {
          product: {
            select: {
              name: true,
              sku: true,
              images: true,
            },
          },
          warehouse: {
            select: {
              name: true,
              address: true,
            },
          },
        },
      });

      return this.transformInventory(inventory);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to create inventory: ${error.message}`);
    }
  }

  async findAll(page: number = 1, limit: number = 10, warehouseId?: string, lowStock?: boolean) {
    const skip = (page - 1) * limit;
    
    let where: any = {};
    
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }
    
    if (lowStock) {
      where = {
        ...where,
        OR: [
          { quantity: { lte: 10 } },
          { quantity: { lte: 10 } }, // Use static threshold since reorderPoint doesn't exist
        ],
      };
    }

    const [inventories, total] = await Promise.all([
      this.prisma.inventory.findMany({
        skip,
        take: limit,
        where,
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
          warehouse: {
            select: {
              name: true,
              address: true,
            },
          },
        },
      }),
      this.prisma.inventory.count({ where }),
    ]);

    return {
      inventories: inventories.map(inventory => this.transformInventory(inventory)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            name: true,
            sku: true,
            description: true,
            price: true,
            images: true,
            categoryId: true,
            sellerId: true,
          },
        },
        warehouse: {
          select: {
            name: true,
            address: true,
          },
        },
      },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    return this.transformInventory(inventory);
  }

  async findByProduct(productId: string) {
    const inventories = await this.prisma.inventory.findMany({
      where: { productId },
      include: {
        warehouse: {
          select: {
            name: true,
            address: true,
          },
        },
      },
    });

    return inventories.map(inventory => this.transformInventory(inventory));
  }

  async findByWarehouse(warehouseId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [inventories, total] = await Promise.all([
      this.prisma.inventory.findMany({
        skip,
        take: limit,
        where: { warehouseId },
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
      this.prisma.inventory.count({ where: { warehouseId } }),
    ]);

    return {
      inventories: inventories.map(inventory => this.transformInventory(inventory)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto) {
    const existingInventory = await this.prisma.inventory.findUnique({
      where: { id },
    });

    if (!existingInventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    try {
      const inventory = await this.prisma.inventory.update({
        where: { id },
        data: updateInventoryDto,
        include: {
          product: {
            select: {
              name: true,
              sku: true,
              images: true,
            },
          },
          warehouse: {
            select: {
              name: true,
              address: true,
            },
          },
        },
      });

      return this.transformInventory(inventory);
    } catch (error) {
      throw new Error(`Failed to update inventory: ${error.message}`);
    }
  }

  async adjustStock(id: string, adjustment: number, reason: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    const newQuantity = inventory.quantity + adjustment;

    if (newQuantity < 0) {
      throw new BadRequestException('Stock adjustment would result in negative quantity');
    }

    try {
      const updatedInventory = await this.prisma.inventory.update({
        where: { id },
        data: {
          quantity: newQuantity,
        },
        include: {
          product: {
            select: {
              name: true,
              sku: true,
            },
          },
          warehouse: {
            select: {
              name: true,
            },
          },
        },
      });

      // Log the stock adjustment (could be extended to create audit records)
      console.log(`Stock adjusted: Product ${updatedInventory.product?.name} in ${updatedInventory.warehouse?.name}: ${adjustment} (${reason})`);

      return this.transformInventory(updatedInventory);
    } catch (error) {
      throw new Error(`Failed to adjust stock: ${error.message}`);
    }
  }

  async checkStock(productId: string, warehouseId?: string): Promise<number> {
    if (warehouseId) {
      const inventory = await this.prisma.inventory.findFirst({
        where: {
          productId,
          warehouseId,
        },
      });
      return inventory?.quantity || 0;
    }

    const inventories = await this.prisma.inventory.findMany({
      where: { productId },
    });

    return inventories.reduce((total, inv) => total + inv.quantity, 0);
  }

  async getLowStockItems(threshold?: number) {
    const where = threshold 
      ? { quantity: { lte: threshold } }
      : { quantity: { lte: 10 } }; // Use static threshold since reorderPoint doesn't exist

    const items = await this.prisma.inventory.findMany({
      where,
      include: {
        product: {
          select: {
            name: true,
            sku: true,
          },
        },
        warehouse: {
          select: {
            name: true,
          },
        },
      },
    });

    return items.map(item => this.transformInventory(item));
  }

  async getInventoryStats(warehouseId?: string) {
    const where = warehouseId ? { warehouseId } : {};

    const [
      totalItems,
      totalProducts,
      lowStockItems,
      outOfStockItems,
      totalValue,
    ] = await Promise.all([
      this.prisma.inventory.aggregate({
        where,
        _sum: { quantity: true },
      }),
      this.prisma.inventory.count({ where }),
      this.prisma.inventory.count({
        where: {
          ...where,
          quantity: { lte: 10 },
        },
      }),
      this.prisma.inventory.count({
        where: {
          ...where,
          quantity: 0,
        },
      }),
      this.prisma.inventory.findMany({
        where,
        include: {
          product: {
            select: {
              price: true,
            },
          },
        },
      }),
    ]);

    const inventoryValue = totalValue.reduce(
      (sum, inv) => sum + (inv.quantity * (inv.product.price?.toNumber() || 0)),
      0
    );

    return {
      totalItems: totalItems._sum.quantity || 0,
      totalProducts,
      lowStockItems,
      outOfStockItems,
      inventoryValue,
    };
  }

  private transformInventory(inventory: any) {
    return {
      ...inventory,
      isLowStock: inventory.quantity <= (inventory.reorderLevel || 10),
      isOutOfStock: inventory.quantity === 0,
      stockValue: inventory.product?.price 
        ? (inventory.quantity * inventory.product.price.toNumber())
        : 0,
      daysSinceLastUpdate: inventory.updatedAt 
        ? Math.floor((Date.now() - new Date(inventory.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
        : null,
    };
  }
}
