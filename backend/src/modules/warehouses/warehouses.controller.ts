import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateWarehouseDto, UpdateWarehouseDto } from '../../common/dto/warehouses/warehouse.dto';
import { ApiResponse } from '../../common/interfaces/response.interface';

@Controller('warehouses')
@UseGuards(FirebaseAuthGuard)
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async create(@Body() createWarehouseDto: CreateWarehouseDto): Promise<ApiResponse> {
    try {
      const warehouse = await this.warehousesService.create(createWarehouseDto);
      return {
        success: true,
        message: 'Warehouse created successfully',
        data: warehouse,
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
    @Query('location') location?: string,
    @Query('isActive') isActive?: string,
  ): Promise<ApiResponse> {
    try {
      const pageNum = parseInt(page || '1') || 1;
      const limitNum = parseInt(limit || '10') || 10;
      const activeFilter = isActive !== undefined ? isActive === 'true' : undefined;
      
      const result = await this.warehousesService.findAll(
        pageNum,
        limitNum,
        location,
        activeFilter,
      );
      return {
        success: true,
        message: 'Warehouses retrieved successfully',
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

  @Get('active')
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller', 'customer')
  async findActiveWarehouses(): Promise<ApiResponse> {
    try {
      const warehouses = await this.warehousesService.findActiveWarehouses();
      return {
        success: true,
        message: 'Active warehouses retrieved successfully',
        data: warehouses,
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

  @Get('capacity')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getWarehousesWithCapacity(): Promise<ApiResponse> {
    try {
      const warehouses = await this.warehousesService.getWarehousesWithCapacity();
      return {
        success: true,
        message: 'Warehouse capacity information retrieved successfully',
        data: warehouses,
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
      const warehouse = await this.warehousesService.findOne(id);
      return {
        success: true,
        message: 'Warehouse retrieved successfully',
        data: warehouse,
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

  @Get(':id/inventory')
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  async getWarehouseInventory(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<ApiResponse> {
    try {
      const pageNum = parseInt(page || '1') || 1;
      const limitNum = parseInt(limit || '10') || 10;
      
      const result = await this.warehousesService.getWarehouseInventory(
        id,
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

  @Get(':id/stats')
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  async getWarehouseStats(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const stats = await this.warehousesService.getWarehouseStats(id);
      return {
        success: true,
        message: 'Warehouse statistics retrieved successfully',
        data: stats,
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
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<ApiResponse> {
    try {
      const warehouse = await this.warehousesService.update(id, updateWarehouseDto);
      return {
        success: true,
        message: 'Warehouse updated successfully',
        data: warehouse,
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

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const result = await this.warehousesService.remove(id);
      return {
        success: true,
        message: result.message || 'Warehouse deactivated successfully',
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
