import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';

/* The `CartItem` class represents an entity for items in a shopping cart with properties for cart ID,
product ID, quantity, and relationships with `Cart` and `Product` entities. */
@Entity({ name: 'cart_items' })
export class CartItem {
  @PrimaryColumn('uuid', { name: 'cart_id' })
  cartId: string;

  @PrimaryColumn('uuid', { name: 'product_id' })
  productId: string;

  @ManyToOne(() => Cart)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('int')
  quantity: number;
}
