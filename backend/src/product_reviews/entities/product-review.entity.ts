import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'product_reviews' })
export class ProductReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => Product, { nullable: false })
  product: Product;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
