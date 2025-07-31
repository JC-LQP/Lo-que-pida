import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity({ name: 'product_reviews' })
export class ProductReview {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.reviews, { nullable: false })
  product: Product;

  @Field(() => Int)
  @Column({ type: 'int' })
  rating: number;

  @Field()
  @Column({ type: 'text' })
  comment: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
