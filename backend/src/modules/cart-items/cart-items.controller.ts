import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateCartItemDto, UpdateCartItemDto } from '../../common/dto/cart-items/cart-item.dto';
import { ApiResponse } from '../../common/interfaces/response.interface';

@Controller('cart-items')
@UseGuards(FirebaseAuthGuard)
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('customer')
  async create(@Body() createCartItemDto: CreateCartItemDto): Promise<ApiResponse> {
    try {
      const cartItem = await this.cartItemsService.create(createCartItemDto);
      return {
        success: true,
        message: 'Item added to cart successfully',
        data: cartItem,
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

  @Get('customer/:customerId')
  @UseGuards(RolesGuard)
  @Roles('customer', 'admin')
  async findByCustomer(@Param('customerId') customerId: string): Promise<ApiResponse> {
    try {
      const cart = await this.cartItemsService.findByCustomer(customerId);
      return {
        success: true,
        message: 'Cart items retrieved successfully',
        data: cart,
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

  @Get('customer/:customerId/summary')
  @UseGuards(RolesGuard)
  @Roles('customer', 'admin')
  async getCartSummary(@Param('customerId') customerId: string): Promise<ApiResponse> {
    try {
      const summary = await this.cartItemsService.getCartSummary(customerId);
      return {
        success: true,
        message: 'Cart summary retrieved successfully',
        data: summary,
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
  @Roles('customer', 'admin')
  async findOne(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const cartItem = await this.cartItemsService.findOne(id);
      return {
        success: true,
        message: 'Cart item retrieved successfully',
        data: cartItem,
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
  @Roles('customer')
  async update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<ApiResponse> {
    try {
      const cartItem = await this.cartItemsService.update(id, updateCartItemDto);
      return {
        success: true,
        message: 'Cart item updated successfully',
        data: cartItem,
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

  @Post(':id/quantity')
  @UseGuards(RolesGuard)
  @Roles('customer')
  async updateQuantity(
    @Param('id') id: string,
    @Body() body: { quantity: number },
  ): Promise<ApiResponse> {
    try {
      const result = await this.cartItemsService.updateQuantity(id, body.quantity);
      return {
        success: true,
        message: body.quantity === 0 
          ? 'Cart item removed successfully' 
          : 'Quantity updated successfully',
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

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('customer')
  async remove(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const result = await this.cartItemsService.remove(id);
      return {
        success: true,
        message: result.message,
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

  @Delete('customer/:customerId/clear')
  @UseGuards(RolesGuard)
  @Roles('customer')
  async clearCart(@Param('customerId') customerId: string): Promise<ApiResponse> {
    try {
      const result = await this.cartItemsService.clearCart(customerId);
      return {
        success: true,
        message: result.message,
        data: { deletedCount: result.deletedCount },
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
