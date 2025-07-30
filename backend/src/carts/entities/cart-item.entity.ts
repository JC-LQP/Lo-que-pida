import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { ProductVariant } from '../../product-variants/entities/product-variant.entity';

@Entity({ name: 'cart_items' })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => ProductVariant, { eager: true, onDelete: 'CASCADE' })
  productVariant: ProductVariant;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
