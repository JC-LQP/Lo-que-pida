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
import { SubscriptionsService } from './subscriptions.service';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from '../../common/dto/subscriptions/subscription.dto';
import { ApiResponse } from '../../common/interfaces/response.interface';

@Controller('subscriptions')
@UseGuards(FirebaseAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('customer', 'admin')
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto): Promise<ApiResponse> {
    try {
      const subscription = await this.subscriptionsService.create(createSubscriptionDto);
      return {
        success: true,
        message: 'Subscription created successfully',
        data: subscription,
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
  @Roles('admin')
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ): Promise<ApiResponse> {
    try {
      const pageNum = parseInt(page || '1') || 1;
      const limitNum = parseInt(limit || '10') || 10;
      
      const result = await this.subscriptionsService.findAll(pageNum, limitNum, status);
      return {
        success: true,
        message: 'Subscriptions retrieved successfully',
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
      const stats = await this.subscriptionsService.getSubscriptionStats();
      return {
        success: true,
        message: 'Subscription statistics retrieved successfully',
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

  @Get('due')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getDueSubscriptions(): Promise<ApiResponse> {
    try {
      const subscriptions = await this.subscriptionsService.getDueSubscriptions();
      return {
        success: true,
        message: 'Due subscriptions retrieved successfully',
        data: subscriptions,
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

  @Get('customer/:customerId')
  @UseGuards(RolesGuard)
  @Roles('customer', 'admin')
  async findByCustomer(
    @Param('customerId') customerId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<ApiResponse> {
    try {
      const pageNum = parseInt(page || '1') || 1;
      const limitNum = parseInt(limit || '10') || 10;
      
      const result = await this.subscriptionsService.findBySeller(
        customerId,
        pageNum,
        limitNum,
      );
      return {
        success: true,
        message: 'Customer subscriptions retrieved successfully',
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

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('customer', 'admin')
  async findOne(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const subscription = await this.subscriptionsService.findOne(id);
      return {
        success: true,
        message: 'Subscription retrieved successfully',
        data: subscription,
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
  @Roles('customer', 'admin')
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<ApiResponse> {
    try {
      const subscription = await this.subscriptionsService.update(id, updateSubscriptionDto);
      return {
        success: true,
        message: 'Subscription updated successfully',
        data: subscription,
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

  @Post(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles('customer', 'admin')
  async cancel(
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ): Promise<ApiResponse> {
    try {
      const subscription = await this.subscriptionsService.cancel(id, body.reason);
      return {
        success: true,
        message: 'Subscription cancelled successfully',
        data: subscription,
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

  @Post(':id/pause')
  @UseGuards(RolesGuard)
  @Roles('customer', 'admin')
  async pause(
    @Param('id') id: string,
    @Body() body: { resumeDate?: string },
  ): Promise<ApiResponse> {
    try {
      const resumeDate = body.resumeDate ? new Date(body.resumeDate) : undefined;
      const subscription = await this.subscriptionsService.pause(id, resumeDate);
      return {
        success: true,
        message: 'Subscription paused successfully',
        data: subscription,
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

  @Post(':id/resume')
  @UseGuards(RolesGuard)
  @Roles('customer', 'admin')
  async resume(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const subscription = await this.subscriptionsService.resume(id);
      return {
        success: true,
        message: 'Subscription resumed successfully',
        data: subscription,
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
