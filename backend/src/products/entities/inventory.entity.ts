import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

import { ProductReview } from '../../reviews/entities/product-review.entity';
import { Seller } from '../../sellers/entities/seller.entity';
// Puedes añadir más imports si tienes relaciones con categorías, imágenes, etc.

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
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Field(() => Seller)
  @ManyToOne(() => Seller)
  @JoinColumn({ name: 'seller_id' })
  seller: Seller;

  @Field(() => [ProductReview], { nullable: true })
  @OneToMany(() => ProductReview, (review) => review.product)
  reviews?: ProductReview[];
}
