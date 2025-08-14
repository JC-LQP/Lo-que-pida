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
import { SellersService } from './sellers.service';
import { CreateSellerDto, UpdateSellerDto } from '../../common/dto/sellers/seller.dto';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/guards/roles.guard';

@Controller('api/sellers')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSellerDto: CreateSellerDto) {
    try {
      const seller = await this.sellersService.create(createSellerDto);
      return { success: true, message: 'Seller created successfully', data: seller };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    try {
      const result = await this.sellersService.findAll(parseInt(page), parseInt(limit));
      return { success: true, message: 'Sellers retrieved successfully', data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  async getStats() {
    try {
      const stats = await this.sellersService.getSellerStats();
      return { success: true, message: 'Seller statistics retrieved successfully', data: stats };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('by-user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    try {
      const seller = await this.sellersService.findByUserId(userId);
      return { success: true, message: 'Seller retrieved successfully', data: seller };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const seller = await this.sellersService.findOne(id);
      return { success: true, message: 'Seller retrieved successfully', data: seller };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    try {
      const seller = await this.sellersService.update(id, updateSellerDto);
      return { success: true, message: 'Seller updated successfully', data: seller };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    try {
      const result = await this.sellersService.remove(id);
      return { success: true, message: result.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
