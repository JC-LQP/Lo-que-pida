import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartInput } from './dto/create-cart.input';
import { AddItemToCartInput } from './dto/add-item-to-cart.input';
import { UpdateCartItemInput } from './dto/update-cart-item.input';
import { Customer } from '../customers/entities/customer.entity';
import { ProductVariant } from '../product-variants/entities/product-variant.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private itemRepo: Repository<CartItem>,

    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,

    @InjectRepository(ProductVariant)
    private variantRepo: Repository<ProductVariant>,
  ) {}

  async create(input: CreateCartInput): Promise<Cart> {
    const customer = await this.customerRepo.findOne({ where: { id: input.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const cart = this.cartRepo.create({ customer });
    return this.cartRepo.save(cart);
  }

  async addItem(input: AddItemToCartInput): Promise<CartItem> {
    const cart = await this.cartRepo.findOne({ where: { id: input.cartId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const variant = await this.variantRepo.findOne({ where: { id: input.productVariantId } });
    if (!variant) throw new NotFoundException('Product variant not found');

    const existingItem = await this.itemRepo.findOne({
      where: { cart: { id: input.cartId }, productVariant: { id: input.productVariantId } },
    });

    if (existingItem) {
      existingItem.quantity += input.quantity;
      return this.itemRepo.save(existingItem);
    }

    const newItem = this.itemRepo.create({
      cart,
      productVariant: variant,
      quantity: input.quantity,
    });

    return this.itemRepo.save(newItem);
  }

  async updateItem(input: UpdateCartItemInput): Promise<CartItem> {
    const item = await this.itemRepo.findOne({ where: { id: input.itemId } });
    if (!item) throw new NotFoundException('Cart item not found');

    item.quantity = input.quantity;
    return this.itemRepo.save(item);
  }

  async removeItem(itemId: string): Promise<boolean> {
    const result = await this.itemRepo.delete(itemId);
    return result.affected > 0;
  }

  async findCartByCustomer(customerId: string): Promise<Cart | null> {
    return this.cartRepo.findOne({
      where: { customer: { id: customerId } },
      relations: ['items', 'items.productVariant'],
    });
  }
}
