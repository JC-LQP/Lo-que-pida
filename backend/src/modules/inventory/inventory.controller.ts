import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateInventoryDto, UpdateInventoryDto } from '../../common/dto/inventory/inventory.dto';
import { ApiResponse } from '../../common/interfaces/response.interface';

@Controller('inventory')
@UseGuards(FirebaseAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  async create(@Body() createInventoryDto: CreateInventoryDto): Promise<ApiResponse> {
    try {
      const inventory = await this.inventoryService.create(createInventoryDto);
      return {
        success: true,
        message: 'Inventory created successfully',
        data: inventory,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('lowStock') lowStock?: string,
  ): Promise<ApiResponse> {
    try {
      const pageNum = parseInt(page || '1') || 1;
      const limitNum = parseInt(limit || '10') || 10;
      const isLowStock = lowStock === 'true';
      
      const result = await this.inventoryService.findAll(
        pageNum,
        limitNum,
        warehouseId,
        isLowStock,
      );
      return {
        success: true,
        message: 'Inventory retrieved successfully',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  async getStats(@Query('warehouseId') warehouseId?: string): Promise<ApiResponse> {
    try {
      const stats = await this.inventoryService.getInventoryStats(warehouseId);
      return {
        success: true,
        message: 'Inventory statistics retrieved successfully',
        data: stats,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Get('low-stock')
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  async getLowStockItems(@Query('threshold') threshold?: string): Promise<ApiResponse> {
    try {
      const thresholdNum = threshold ? parseInt(threshold) : undefined;
      const items = await this.inventoryService.getLowStockItems(thresholdNum);
      return {
        success: true,
        message: 'Low stock items retrieved successfully',
        data: items,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Get('product/:productId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  async findByProduct(@Param('productId') productId: string): Promise<ApiResponse> {
    try {
      const inventories = await this.inventoryService.findByProduct(productId);
      return {
        success: true,
        message: 'Product inventories retrieved successfully',
        data: inventories,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  }

  @Get('warehouse/:warehouseId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  async findByWarehouse(
    @Param('warehouseId') warehouseId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<ApiResponse> {
    try {
      const pageNum = parseInt(page || '1') || 1;
      const limitNum = parseInt(limit || '10') || 10;
      
      const result = await this.inventoryService.findByWarehouse(
        warehouseId,
        pageNum,
        limitNum,
      );
      return {
        success: true,
        message: 'Warehouse inventory retrieved successfully',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  }

  @Get('check-stock/:productId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller', 'customer')
  async checkStock(
    @Param('productId') productId: string,
    @Query('warehouseId') warehouseId?: string,
  ): Promise<ApiResponse> {
    try {
      const stock = await this.inventoryService.checkStock(productId, warehouseId);
      return {
        success: true,
        message: 'Stock level retrieved successfully',
        data: { productId, warehouseId, stock },
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  async findOne(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const inventory = await this.inventoryService.findOne(id);
      return {
        success: true,
        message: 'Inventory retrieved successfully',
        data: inventory,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  async update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<ApiResponse> {
    try {
      const inventory = await this.inventoryService.update(id, updateInventoryDto);
      return {
        success: true,
        message: 'Inventory updated successfully',
        data: inventory,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Post(':id/adjust')
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  async adjustStock(
    @Param('id') id: string,
    @Body() body: { adjustment: number; reason: string },
  ): Promise<ApiResponse> {
    try {
      const inventory = await this.inventoryService.adjustStock(
        id,
        body.adjustment,
        body.reason,
      );
      return {
        success: true,
        message: 'Stock adjusted successfully',
        data: inventory,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
