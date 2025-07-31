import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

import { Seller } from '../../sellers/entities/seller.entity';
import { ProductReview } from '../../product_reviews/entities/product-review.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { ProductCondition } from '../../common/enums/product-condition.enum';

@ObjectType()
@Entity({ name: 'products' })
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Field(() => ProductCondition)
  @Column({ type: 'enum', enum: ProductCondition })
  condition: ProductCondition;

  @Field(() => Seller)
  @ManyToOne(() => Seller, (seller) => seller.products)
  seller: Seller;

  @Field(() => [ProductReview], { nullable: true })
  @OneToMany(() => ProductReview, (review) => review.product)
  reviews?: ProductReview[];

  @Field(() => Inventory, { nullable: true })
  @ManyToOne(() => Inventory, (inventory) => inventory.product)
  inventory?: Inventory;

  @Field(() => [OrderItem], { nullable: true })
  @OneToMany(() => OrderItem, (item) => item.product)
  orderItems?: OrderItem[];

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
