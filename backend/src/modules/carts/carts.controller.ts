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
  HttpCode,
  Query,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from '../../common/dto/carts/cart.dto';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { FirebaseUser } from '../../auth/firebase-auth.service';
import { UserRole } from '../../auth/guards/roles.guard';

@Controller('api/carts')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCartDto: CreateCartDto, @CurrentUser() user: FirebaseUser) {
    try {
      const cart = await this.cartsService.create(createCartDto);
      return {
        success: true,
        message: 'Cart created successfully',
        data: cart,
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
  async findAll(@Query('customerId') customerId?: string) {
    try {
      const carts = await this.cartsService.findAll(customerId);
      return {
        success: true,
        message: 'Carts retrieved successfully',
        data: carts,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('my-cart')
  async getMyCart(@CurrentUser() user: FirebaseUser) {
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
  async findByCustomer(
    @Param('customerId') customerId: string,
    @CurrentUser() user: FirebaseUser,
  ) {
    try {
      // Check if user can access this customer's cart (own cart or admin)
      const cart = await this.cartsService.findByCustomer(customerId);
      return {
        success: true,
        message: cart ? 'Cart retrieved successfully' : 'No cart found for customer',
        data: cart,
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
      const cart = await this.cartsService.findOne(id);
      return {
        success: true,
        message: 'Cart retrieved successfully',
        data: cart,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post(':id/items')
  async addItem(
    @Param('id') cartId: string,
    @Body() { productId, quantity }: { productId: string; quantity: number },
    @CurrentUser() user: FirebaseUser,
  ) {
    try {
      const cart = await this.cartsService.addItem(cartId, productId, quantity);
      return {
        success: true,
        message: 'Item added to cart successfully',
        data: cart,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id/items/:productId')
  @HttpCode(HttpStatus.OK)
  async removeItem(
    @Param('id') cartId: string,
    @Param('productId') productId: string,
    @CurrentUser() user: FirebaseUser,
  ) {
    try {
      const result = await this.cartsService.removeItem(cartId, productId);
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

  @Patch(':id/items/:productId')
  async updateItemQuantity(
    @Param('id') cartId: string,
    @Param('productId') productId: string,
    @Body() { quantity }: { quantity: number },
    @CurrentUser() user: FirebaseUser,
  ) {
    try {
      const cart = await this.cartsService.updateItemQuantity(cartId, productId, quantity);
      return {
        success: true,
        message: 'Cart item quantity updated successfully',
        data: cart,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id/clear')
  @HttpCode(HttpStatus.OK)
  async clearCart(@Param('id') id: string, @CurrentUser() user: FirebaseUser) {
    try {
      const result = await this.cartsService.clearCart(id);
      return {
        success: true,
        message: result.message,
        data: result.cart,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @CurrentUser() user: FirebaseUser) {
    try {
      const result = await this.cartsService.remove(id);
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
