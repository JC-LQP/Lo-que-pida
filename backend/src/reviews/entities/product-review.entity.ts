import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';

import { Customer } from '../../customers/entities/customer.entity';
import { Product } from '../../products/entities/product.entity';

export enum ReviewRating {
  ONE = 1,
  TWO,
  THREE,
  FOUR,
  FIVE,
}

registerEnumType(ReviewRating, {
  name: 'ReviewRating',
  description: 'Rating scale from 1 to 5',
});

@ObjectType()
@Entity({ name: 'reviews' })
export class ProductReview {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
  product: Product;

  @Field(() => Customer)
  @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
  customer: Customer;

  @Field(() => ReviewRating)
  @Column({ type: 'enum', enum: ReviewRating })
  rating: ReviewRating;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
