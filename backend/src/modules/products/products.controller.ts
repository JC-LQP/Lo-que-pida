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
import { ProductsService } from './products.service';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  ProductFilterDto, 
  BulkUpdateProductsDto 
} from '../../common/dto/products/product.dto';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { FirebaseUser } from '../../auth/firebase-auth.service';
import { UserRole } from '../../auth/guards/roles.guard';

@Controller('api/products')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: FirebaseUser,
  ) {
    try {
      // Get seller ID from user
      // This would typically require a service call to get the seller record
      const product = await this.productsService.create(createProductDto);
      return {
        success: true,
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get()
  @Public()
  async findAll(
    @Query() filters: ProductFilterDto,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const result = await this.productsService.findAll(
        filters,
        parseInt(page),
        parseInt(limit),
      );
      return {
        success: true,
        message: 'Products retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('featured')
  @Public()
  async getFeaturedProducts(@Query('limit') limit: string = '12') {
    try {
      const products = await this.productsService.getFeaturedProducts(parseInt(limit));
      return {
        success: true,
        message: 'Featured products retrieved successfully',
        data: products,
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
  async getProductStats() {
    try {
      const stats = await this.productsService.getProductStats();
      return {
        success: true,
        message: 'Product statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('my-products')
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  async getMyProducts(
    @CurrentUser() user: FirebaseUser,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      // This would need to get the seller ID from the user
      // For now, we'll pass undefined and handle it in the service
      const result = await this.productsService.getSellerProducts(
        'seller-id', // This should come from user context
        parseInt(page),
        parseInt(limit),
      );
      return {
        success: true,
        message: 'Your products retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('seller/:sellerId')
  @Public()
  async getSellerProducts(
    @Param('sellerId') sellerId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const result = await this.productsService.getSellerProducts(
        sellerId,
        parseInt(page),
        parseInt(limit),
      );
      return {
        success: true,
        message: 'Seller products retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('slug/:slug')
  @Public()
  async findBySlug(@Param('slug') slug: string) {
    try {
      const product = await this.productsService.findBySlug(slug);
      return {
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne(id);
      return {
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch('bulk-update')
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  async bulkUpdate(
    @Body() bulkUpdateDto: BulkUpdateProductsDto,
    @CurrentUser() user: FirebaseUser,
  ) {
    try {
      const result = await this.productsService.bulkUpdate(
        bulkUpdateDto,
        user.role as UserRole,
        'seller-id', // This should come from user context
      );
      return {
        success: true,
        message: result.message,
        data: { updatedCount: result.updatedCount },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch(':id')
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: FirebaseUser,
  ) {
    try {
      const product = await this.productsService.update(
        id,
        updateProductDto,
        user.role as UserRole,
        'seller-id', // This should come from user context
      );
      return {
        success: true,
        message: 'Product updated successfully',
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id')
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: FirebaseUser,
  ) {
    try {
      const result = await this.productsService.remove(
        id,
        user.role as UserRole,
        'seller-id', // This should come from user context
      );
      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
