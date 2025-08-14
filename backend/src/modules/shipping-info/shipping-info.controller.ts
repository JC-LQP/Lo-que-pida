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
import { ShippingInfoService } from './shipping-info.service';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateShippingInfoDto, UpdateShippingInfoDto } from '../../common/dto/shipping-info/shipping-info.dto';
import { ApiResponse } from '../../common/interfaces/response.interface';

@Controller('shipping-info')
@UseGuards(FirebaseAuthGuard)
export class ShippingInfoController {
  constructor(private readonly shippingInfoService: ShippingInfoService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  async create(@Body() createShippingInfoDto: CreateShippingInfoDto): Promise<ApiResponse> {
    try {
      const shippingInfo = await this.shippingInfoService.create(createShippingInfoDto);
      return {
        success: true,
        message: 'Shipping info created successfully',
        data: shippingInfo,
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
    @Query('status') status?: string,
  ): Promise<ApiResponse> {
    try {
      const pageNum = parseInt(page || '1') || 1;
      const limitNum = parseInt(limit || '10') || 10;
      
      const result = await this.shippingInfoService.findAll(pageNum, limitNum, status);
      return {
        success: true,
        message: 'Shipping info retrieved successfully',
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
  @Roles('admin')
  async getStats(): Promise<ApiResponse> {
    try {
      const stats = await this.shippingInfoService.getShippingStats();
      return {
        success: true,
        message: 'Shipping statistics retrieved successfully',
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

  @Get('track/:trackingNumber')
  @UseGuards(RolesGuard)
  @Roles('customer', 'seller', 'admin')
  async findByTrackingNumber(@Param('trackingNumber') trackingNumber: string): Promise<ApiResponse> {
    try {
      const shippingInfo = await this.shippingInfoService.findByTrackingNumber(trackingNumber);
      return {
        success: true,
        message: 'Shipping info retrieved successfully',
        data: shippingInfo,
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

  @Get('order/:orderId')
  @UseGuards(RolesGuard)
  @Roles('customer', 'seller', 'admin')
  async findByOrder(@Param('orderId') orderId: string): Promise<ApiResponse> {
    try {
      const shippingInfos = await this.shippingInfoService.findByOrder(orderId);
      return {
        success: true,
        message: 'Order shipping info retrieved successfully',
        data: shippingInfos,
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

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('customer', 'seller', 'admin')
  async findOne(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const shippingInfo = await this.shippingInfoService.findOne(id);
      return {
        success: true,
        message: 'Shipping info retrieved successfully',
        data: shippingInfo,
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
    @Body() updateShippingInfoDto: UpdateShippingInfoDto,
  ): Promise<ApiResponse> {
    try {
      const shippingInfo = await this.shippingInfoService.update(id, updateShippingInfoDto);
      return {
        success: true,
        message: 'Shipping info updated successfully',
        data: shippingInfo,
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

  // Note: updateStatus method removed because ShippingInfo model doesn't have status field
}
