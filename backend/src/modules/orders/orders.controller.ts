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
  HttpCode,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { 
  CreateOrderDto, 
  UpdateOrderDto, 
  OrderFilterDto,
  UpdateOrderStatusDto
} from '../../common/dto/orders/order.dto';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { FirebaseUser } from '../../auth/firebase-auth.service';
import { UserRole } from '../../auth/guards/roles.guard';

@Controller('api/orders')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: FirebaseUser) {
    try {
      const order = await this.ordersService.create(createOrderDto);
      return {
        success: true,
        message: 'Order created successfully',
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query() filters: OrderFilterDto,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const result = await this.ordersService.findAll(
        filters,
        parseInt(page),
        parseInt(limit),
      );
      return {
        success: true,
        message: 'Orders retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  async getOrderStats() {
    try {
      const stats = await this.ordersService.getOrderStats();
      return {
        success: true,
        message: 'Order statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('my-orders')
  async getMyOrders(
    @CurrentUser() user: FirebaseUser,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      // This would need to get the customer ID from the user
      // For now, we'll return a placeholder
      return {
        success: false,
        message: 'Customer ID resolution needed',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('customer/:customerId')
  async getCustomerOrders(
    @Param('customerId') customerId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @CurrentUser() user: FirebaseUser,
  ) {
    try {
      const result = await this.ordersService.getCustomerOrders(
        customerId,
        parseInt(page),
        parseInt(limit),
      );
      return {
        success: true,
        message: 'Customer orders retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: FirebaseUser) {
    try {
      const order = await this.ordersService.findOne(id, user.role as any);
      return {
        success: true,
        message: 'Order retrieved successfully',
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
    @CurrentUser() user: FirebaseUser,
  ) {
    try {
      const order = await this.ordersService.updateStatus(
        id,
        updateStatusDto,
        user.role as any,
      );
      return {
        success: true,
        message: 'Order status updated successfully',
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
