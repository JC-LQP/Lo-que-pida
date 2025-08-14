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
import { PaymentsService } from './payments.service';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreatePaymentDto, UpdatePaymentDto } from '../../common/dto/payments/payment.dto';
import { ApiResponse } from '../../common/interfaces/response.interface';

@Controller('payments')
@UseGuards(FirebaseAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('customer', 'seller', 'admin')
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<ApiResponse> {
    try {
      const payment = await this.paymentsService.create(createPaymentDto);
      return {
        success: true,
        message: 'Payment created successfully',
        data: payment,
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
  ): Promise<ApiResponse> {
    try {
      const pageNum = parseInt(page || '1') || 1;
      const limitNum = parseInt(limit || '10') || 10;
      
      const result = await this.paymentsService.findAll(pageNum, limitNum);
      return {
        success: true,
        message: 'Payments retrieved successfully',
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
      const stats = await this.paymentsService.getPaymentStats();
      return {
        success: true,
        message: 'Payment statistics retrieved successfully',
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

  @Get('order/:orderId')
  @UseGuards(RolesGuard)
  @Roles('customer', 'seller', 'admin')
  async findByOrder(@Param('orderId') orderId: string): Promise<ApiResponse> {
    try {
      const payments = await this.paymentsService.findByOrder(orderId);
      return {
        success: true,
        message: 'Order payments retrieved successfully',
        data: payments,
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
      const payment = await this.paymentsService.findOne(id);
      return {
        success: true,
        message: 'Payment retrieved successfully',
        data: payment,
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
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<ApiResponse> {
    try {
      const payment = await this.paymentsService.update(id, updatePaymentDto);
      return {
        success: true,
        message: 'Payment updated successfully',
        data: payment,
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

  @Post(':id/process')
  @UseGuards(RolesGuard)
  @Roles('admin', 'seller')
  async processPayment(
    @Param('id') id: string,
    @Body() body: { transactionId: string; providerResponse?: any },
  ): Promise<ApiResponse> {
    try {
      const payment = await this.paymentsService.processPayment(
        id,
        body.transactionId,
        body.providerResponse,
      );
      return {
        success: true,
        message: 'Payment processed successfully',
        data: payment,
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

  @Post(':id/fail')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async failPayment(
    @Param('id') id: string,
    @Body() body: { failureReason: string },
  ): Promise<ApiResponse> {
    try {
      const payment = await this.paymentsService.failPayment(id, body.failureReason);
      return {
        success: true,
        message: 'Payment marked as failed',
        data: payment,
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
