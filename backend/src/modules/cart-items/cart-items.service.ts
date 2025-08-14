import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCartItemDto, UpdateCartItemDto } from '../../common/dto/cart-items/cart-item.dto';

@Injectable()
export class CartItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createCartItemDto: CreateCartItemDto) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { id: createCartItemDto.customerId },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      const product = await this.prisma.product.findUnique({
        where: { id: createCartItemDto.productId },
        include: {
          inventory: {
            select: {
              quantity: true,
            },
          },
        },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Check stock availability
      const totalStock = product.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
      if (totalStock < createCartItemDto.quantity) {
        throw new BadRequestException('Insufficient stock available');
      }

      // First, find or create a cart for the customer
      let cart = await this.prisma.cart.findFirst({
        where: { customerId: createCartItemDto.customerId },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { customerId: createCartItemDto.customerId },
        });
      }

      // Check if item already exists in this cart
      const existingCartItem = await this.prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: createCartItemDto.productId,
        },
      });

      let cartItem;

      if (existingCartItem) {
        // Update existing item quantity
        const newQuantity = existingCartItem.quantity + createCartItemDto.quantity;
        
        if (totalStock < newQuantity) {
          throw new BadRequestException('Insufficient stock for the requested quantity');
        }

        cartItem = await this.prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: newQuantity },
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: true,
                sku: true,
              },
            },
          },
        });
      } else {
        // Create new cart item
        cartItem = await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: createCartItemDto.productId,
            quantity: createCartItemDto.quantity,
            price: product.price,
          },
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: true,
                sku: true,
              },
            },
          },
        });
      }

      return this.transformCartItem(cartItem);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to add item to cart: ${error.message}`);
    }
  }

  async findByCustomer(customerId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        cart: {
          customerId: customerId,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            images: true,
            sku: true,
            isActive: true,
          },
        },
      },
    });

    const transformedItems = cartItems.map(item => this.transformCartItem(item));
    const totalAmount = transformedItems.reduce(
      (sum, item) => sum + item.totalPrice, 
      0
    );

    return {
      cartItems: transformedItems,
      totalItems: cartItems.length,
      totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount,
    };
  }

  async findOne(id: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: {
          include: {
            customer: {
              include: {
                user: {
                  select: {
                    displayName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        product: {
          select: {
            name: true,
            description: true,
            price: true,
            images: true,
            sku: true,
            isActive: true,
            inventory: {
              select: {
                quantity: true,
              },
            },
          },
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    return this.transformCartItem(cartItem);
  }

  async update(id: string, updateCartItemDto: UpdateCartItemDto) {
    const existingCartItem = await this.prisma.cartItem.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            inventory: {
              select: {
                quantity: true,
              },
            },
          },
        },
      },
    });

    if (!existingCartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    // Check stock if quantity is being updated
    if (updateCartItemDto.quantity) {
      const totalStock = existingCartItem.product.inventory.reduce(
        (sum, inv) => sum + inv.quantity, 
        0
      );
      
      if (totalStock < updateCartItemDto.quantity) {
        throw new BadRequestException('Insufficient stock for the requested quantity');
      }
    }

    try {
      const cartItem = await this.prisma.cartItem.update({
        where: { id },
        data: updateCartItemDto,
        include: {
          product: {
            select: {
              name: true,
              price: true,
              images: true,
              sku: true,
            },
          },
        },
      });

      return this.transformCartItem(cartItem);
    } catch (error) {
      throw new Error(`Failed to update cart item: ${error.message}`);
    }
  }

  async remove(id: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    try {
      await this.prisma.cartItem.delete({
        where: { id },
      });

      return { message: 'Cart item removed successfully' };
    } catch (error) {
      throw new Error(`Failed to remove cart item: ${error.message}`);
    }
  }

  async clearCart(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    try {
      const result = await this.prisma.cartItem.deleteMany({
        where: {
          cart: {
            customerId: customerId,
          },
        },
      });

      return { 
        message: 'Cart cleared successfully',
        deletedCount: result.count,
      };
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  }

  async updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      // If quantity is 0 or negative, remove the item
      return this.remove(id);
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            inventory: {
              select: {
                quantity: true,
              },
            },
          },
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    // Check stock availability
    const totalStock = cartItem.product.inventory.reduce(
      (sum, inv) => sum + inv.quantity, 
      0
    );
    
    if (totalStock < quantity) {
      throw new BadRequestException('Insufficient stock for the requested quantity');
    }

    try {
      const updatedCartItem = await this.prisma.cartItem.update({
        where: { id },
        data: { quantity },
        include: {
          product: {
            select: {
              name: true,
              price: true,
              images: true,
              sku: true,
            },
          },
        },
      });

      return this.transformCartItem(updatedCartItem);
    } catch (error) {
      throw new Error(`Failed to update quantity: ${error.message}`);
    }
  }

  async getCartSummary(customerId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        cart: {
          customerId: customerId,
        },
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            isActive: true,
          },
        },
      },
    });

    const activeItems = cartItems.filter(item => item.product.isActive);
    const inactiveItems = cartItems.filter(item => !item.product.isActive);

    const subtotal = activeItems.reduce(
      (sum, item) => sum + (item.quantity * (item.product.price?.toNumber() || 0)), 
      0
    );

    // Simple tax calculation (could be more sophisticated)
    const taxRate = 0.1; // 10%
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      totalItems: activeItems.length,
      totalQuantity: activeItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      tax,
      total,
      inactiveItemsCount: inactiveItems.length,
      hasInactiveItems: inactiveItems.length > 0,
    };
  }

  private transformCartItem(cartItem: any) {
    const price = cartItem.product?.price?.toNumber() || 0;
    const totalPrice = cartItem.quantity * price;

    return {
      ...cartItem,
      product: {
        ...cartItem.product,
        price,
      },
      totalPrice,
      isAvailable: cartItem.product?.isActive ?? true,
    };
  }
}
