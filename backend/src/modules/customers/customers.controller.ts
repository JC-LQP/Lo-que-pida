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
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from '../../common/dto/customers/customer.dto';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { FirebaseUser } from '../../auth/firebase-auth.service';
import { UserRole } from '../../auth/guards/roles.guard';

@Controller('api/customers')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      const customer = await this.customersService.create(createCustomerDto);
      return { success: true, message: 'Customer created successfully', data: customer };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    try {
      const result = await this.customersService.findAll(parseInt(page), parseInt(limit));
      return { success: true, message: 'Customers retrieved successfully', data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  async getStats() {
    try {
      const stats = await this.customersService.getCustomerStats();
      return { success: true, message: 'Customer statistics retrieved successfully', data: stats };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('by-user/:userId')
  async findByUserId(@Param('userId') userId: string, @CurrentUser() user: FirebaseUser) {
    try {
      const customer = await this.customersService.findByUserId(userId);
      return { success: true, message: 'Customer retrieved successfully', data: customer };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const customer = await this.customersService.findOne(id);
      return { success: true, message: 'Customer retrieved successfully', data: customer };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get(':id/activity')
  async getActivity(@Param('id') id: string) {
    try {
      const activity = await this.customersService.getCustomerActivity(id);
      return { success: true, message: 'Customer activity retrieved successfully', data: activity };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    try {
      const customer = await this.customersService.update(id, updateCustomerDto);
      return { success: true, message: 'Customer updated successfully', data: customer };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Patch(':id/loyalty-points')
  async updateLoyaltyPoints(
    @Param('id') id: string,
    @Body() body: { points: number; operation?: 'add' | 'subtract' | 'set' },
  ) {
    try {
      const customer = await this.customersService.updateLoyaltyPoints(
        id,
        body.points,
        body.operation || 'add',
      );
      return { success: true, message: 'Loyalty points updated successfully', data: customer };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    try {
      const result = await this.customersService.remove(id);
      return { success: true, message: result.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
