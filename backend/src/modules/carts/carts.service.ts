import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCartDto, UpdateCartDto } from '../../common/dto/carts/cart.dto';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  async create(createCartDto: CreateCartDto) {
    try {
      // Validate customer exists
      const customer = await this.prisma.customer.findUnique({
        where: { id: createCartDto.customerId },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      // Check if customer already has an active cart
      const existingCart = await this.prisma.cart.findFirst({
        where: {
          customerId: createCartDto.customerId,
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  isActive: true,
                },
              },
            },
          },
        },
      });

      if (existingCart) {
        return this.transformCart(existingCart);
      }

      const cart = await this.prisma.cart.create({
        data: createCartDto,
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
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  images: true,
                  isActive: true,
                },
              },
            },
          },
        },
      });

      return this.transformCart(cart);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to create cart: ${error.message}`);
    }
  }

  async findAll(customerId?: string) {
    const where = customerId ? { customerId } : {};

    const carts = await this.prisma.cart.findMany({
      where,
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
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return carts.map(cart => this.transformCart(cart));
  }

  async findOne(id: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
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
        items: {
          include: {
            product: {
              include: {
                category: true,
                seller: {
                  include: {
                    user: {
                      select: {
                        displayName: true,
                      },
                    },
                  },
                },
                inventory: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return this.transformCart(cart);
  }

  async findByCustomer(customerId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { customerId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                seller: {
                  include: {
                    user: {
                      select: {
                        displayName: true,
                      },
                    },
                  },
                },
                inventory: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    if (!cart) {
      return null;
    }

    return this.transformCart(cart);
  }

  async addItem(cartId: string, productId: string, quantity: number) {
    try {
      // Validate cart exists
      const cart = await this.prisma.cart.findUnique({
        where: { id: cartId },
      });

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      // Validate product exists and is active
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: {
          inventory: true,
        },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (!product.isActive) {
        throw new BadRequestException('Product is not available');
      }

      // Check stock availability
      const totalStock = product.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
      if (product.trackQuantity && totalStock < quantity) {
        throw new BadRequestException('Insufficient stock available');
      }

      // Check if item already exists in cart
      const existingItem = await this.prisma.cartItem.findFirst({
        where: {
          cartId,
          productId,
        },
      });

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        if (product.trackQuantity && totalStock < newQuantity) {
          throw new BadRequestException('Insufficient stock available');
        }

        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: newQuantity,
          },
        });
      } else {
        // Create new cart item
        await this.prisma.cartItem.create({
          data: {
            cartId,
            productId,
            quantity,
            price: product.price,
          },
        });
      }

      // Update cart timestamp
      await this.prisma.cart.update({
        where: { id: cartId },
        data: { updatedAt: new Date() },
      });

      return this.findOne(cartId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to add item to cart: ${error.message}`);
    }
  }

  async removeItem(cartId: string, productId: string) {
    try {
      const cartItem = await this.prisma.cartItem.findFirst({
        where: {
          cartId,
          productId,
        },
      });

      if (!cartItem) {
        throw new NotFoundException('Cart item not found');
      }

      await this.prisma.cartItem.delete({
        where: { id: cartItem.id },
      });

      // Update cart timestamp
      await this.prisma.cart.update({
        where: { id: cartId },
        data: { updatedAt: new Date() },
      });

      return { message: 'Item removed from cart successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to remove item from cart: ${error.message}`);
    }
  }

  async updateItemQuantity(cartId: string, productId: string, quantity: number) {
    try {
      if (quantity <= 0) {
        return this.removeItem(cartId, productId);
      }

      const cartItem = await this.prisma.cartItem.findFirst({
        where: {
          cartId,
          productId,
        },
        include: {
          product: {
            include: {
              inventory: true,
            },
          },
        },
      });

      if (!cartItem) {
        throw new NotFoundException('Cart item not found');
      }

      // Check stock availability
      const totalStock = cartItem.product.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
      if (cartItem.product.trackQuantity && totalStock < quantity) {
        throw new BadRequestException('Insufficient stock available');
      }

      await this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity },
      });

      // Update cart timestamp
      await this.prisma.cart.update({
        where: { id: cartId },
        data: { updatedAt: new Date() },
      });

      return this.findOne(cartId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to update cart item quantity: ${error.message}`);
    }
  }

  async clearCart(id: string) {
    try {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: id },
      });

      const cart = await this.prisma.cart.update({
        where: { id },
        data: { updatedAt: new Date() },
        include: {
          items: true,
        },
      });

      return { message: 'Cart cleared successfully', cart };
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  }

  async remove(id: string) {
    const existingCart = await this.prisma.cart.findUnique({
      where: { id },
    });

    if (!existingCart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    try {
      // Delete cart items first
      await this.prisma.cartItem.deleteMany({
        where: { cartId: id },
      });

      // Delete cart
      await this.prisma.cart.delete({
        where: { id },
      });

      return { message: `Cart with ID ${id} has been deleted` };
    } catch (error) {
      throw new Error(`Failed to delete cart: ${error.message}`);
    }
  }

  private transformCart(cart: any) {
    const items = cart.items?.map((item: any) => ({
      ...item,
      price: item.price.toNumber(),
      totalPrice: item.price.toNumber() * item.quantity,
      product: {
        ...item.product,
        price: item.product.price.toNumber(),
      },
    })) || [];

    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      ...cart,
      items,
      subtotal,
      itemCount,
      isEmpty: items.length === 0,
    };
  }
}
