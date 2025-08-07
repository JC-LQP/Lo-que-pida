import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard, RolesGuard, CurrentUser, Public, Roles, FirebaseUser, UserRole } from './auth';

@Controller('ecommerce')
@UseGuards(FirebaseAuthGuard, RolesGuard) // Apply authentication to all routes by default
export class ExampleEcommerceController {

  // PUBLIC ROUTES (No authentication required)
  
  @Get('products')
  @Public()
  getProducts() {
    return {
      success: true,
      products: [
        { id: 1, name: 'iPhone 15', price: 999 },
        { id: 2, name: 'Samsung Galaxy S24', price: 899 }
      ]
    };
  }

  @Get('categories')
  @Public()
  getCategories() {
    return {
      success: true,
      categories: ['Electronics', 'Clothing', 'Books']
    };
  }

  // CUSTOMER ROUTES (Requires authentication)

  @Get('my-orders')
  getMyOrders(@CurrentUser() user: FirebaseUser) {
    return {
      success: true,
      message: `Orders for ${user.email}`,
      customerId: user.uid,
      orders: [
        { id: 1, status: 'shipped', total: 999 },
        { id: 2, status: 'processing', total: 150 }
      ]
    };
  }

  @Post('orders')
  createOrder(
    @CurrentUser() user: FirebaseUser,
    @Body() orderData: { items: any[], total: number }
  ) {
    return {
      success: true,
      message: 'Order created successfully',
      orderId: Math.random().toString(36).substr(2, 9),
      customerId: user.uid,
      customerEmail: user.email,
      items: orderData.items,
      total: orderData.total
    };
  }

  @Get('profile')
  getProfile(@CurrentUser() user: FirebaseUser) {
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified
      }
    };
  }

  // SELLER ROUTES (Only sellers and admins can access)

  @Post('products')
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  createProduct(
    @CurrentUser() user: FirebaseUser,
    @Body() productData: { name: string, price: number, description: string }
  ) {
    return {
      success: true,
      message: 'Product created successfully',
      product: {
        id: Math.random().toString(36).substr(2, 9),
        ...productData,
        sellerId: user.uid,
        sellerEmail: user.email
      }
    };
  }

  @Get('my-products')
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  getMyProducts(@CurrentUser() user: FirebaseUser) {
    return {
      success: true,
      message: `Products for seller ${user.email}`,
      sellerId: user.uid,
      products: [
        { id: 1, name: 'My Product 1', price: 50 },
        { id: 2, name: 'My Product 2', price: 75 }
      ]
    };
  }

  // ADMIN ROUTES (Only admins can access)

  @Get('admin/all-orders')
  @Roles(UserRole.ADMIN)
  getAllOrders(@CurrentUser() admin: FirebaseUser) {
    return {
      success: true,
      message: `All orders retrieved by admin ${admin.email}`,
      orders: [
        { id: 1, customerId: 'user123', status: 'shipped', total: 999 },
        { id: 2, customerId: 'user456', status: 'processing', total: 150 }
      ]
    };
  }

  @Put('admin/orders/:orderId/status')
  @Roles(UserRole.ADMIN)
  updateOrderStatus(
    @CurrentUser() admin: FirebaseUser,
    @Param('orderId') orderId: string,
    @Body() { status }: { status: string }
  ) {
    return {
      success: true,
      message: `Order ${orderId} status updated to ${status} by admin ${admin.email}`,
      orderId,
      newStatus: status,
      updatedBy: admin.uid
    };
  }

  @Delete('admin/products/:productId')
  @Roles(UserRole.ADMIN)
  deleteProduct(
    @CurrentUser() admin: FirebaseUser,
    @Param('productId') productId: string
  ) {
    return {
      success: true,
      message: `Product ${productId} deleted by admin ${admin.email}`,
      deletedBy: admin.uid
    };
  }
}
