import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { BestBuyService } from './bestbuy.service';
import { ApiResponse } from '../../common/interfaces/response.interface';

@Controller('api/bestbuy')
export class BestBuyController {
  constructor(private readonly bestBuyService: BestBuyService) {}

  @Get('products')
  async searchProducts(
    @Query('query') query?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('onSale') onSale?: string | boolean,
    @Query('inStock') inStock?: string | boolean,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<ApiResponse<any>> {
    try {
      const response = await this.bestBuyService.searchProducts({
        query,
        category,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        onSale: onSale === true || onSale === 'true',
        inStock: inStock === true || inStock === 'true',
        page: page ? Number(page) : 1,
        pageSize: pageSize ? Number(pageSize) : 25,
      });

      // Convert to our internal format
      const convertedProducts = response.products.map(product => 
        this.bestBuyService.convertToInternalProduct(product)
      );

      return {
        success: true,
        statusCode: 200,
        data: {
          products: convertedProducts,
          total: response.total,
          page: response.currentPage,
          totalPages: response.totalPages,
          from: response.from,
          to: response.to,
        },
        message: 'Best Buy products retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        errors: [{ message: error.message }],
        message: 'Failed to retrieve Best Buy products',
      };
    }
  }

  @Get('products/featured')
  async getFeaturedProducts(
    @Query('limit') limit?: number,
  ): Promise<ApiResponse<any[]>> {
    try {
      const products = await this.bestBuyService.getFeaturedProducts(
        limit ? Number(limit) : 12
      );

      const convertedProducts = products.map(product => 
        this.bestBuyService.convertToInternalProduct(product)
      );

      return {
        success: true,
        statusCode: 200,
        data: convertedProducts,
        message: 'Featured Best Buy products retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        errors: [{ message: error.message }],
        message: 'Failed to retrieve featured Best Buy products',
      };
    }
  }

  @Get('products/:sku')
  async getProduct(@Param('sku') sku: string): Promise<ApiResponse<any>> {
    try {
      const product = await this.bestBuyService.getProduct(sku);
      
      if (!product) {
        return {
          success: false,
          statusCode: 404,
          errors: [{ message: 'Product not found' }],
          message: `Product with SKU ${sku} not found on Best Buy`,
        };
      }

      const convertedProduct = this.bestBuyService.convertToInternalProduct(product);

      return {
        success: true,
        statusCode: 200,
        data: convertedProduct,
        message: 'Best Buy product retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        errors: [{ message: error.message }],
        message: 'Failed to retrieve Best Buy product',
      };
    }
  }

  @Get('health')
  async checkHealth(): Promise<ApiResponse<any>> {
    try {
      // Test the API by searching for a small result set
      await this.bestBuyService.searchProducts({
        pageSize: 1,
        inStock: true,
      });

      return {
        success: true,
        statusCode: 200,
        data: { status: 'healthy', service: 'Best Buy API' },
        message: 'Best Buy API is accessible',
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 503,
        errors: [{ message: error.message }],
        message: 'Best Buy API is not accessible',
      };
    }
  }
}
