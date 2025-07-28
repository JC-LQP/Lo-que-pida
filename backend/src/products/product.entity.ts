import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Seller } from '../sellers/seller.entity';

export enum ProductCondition {
  NEW = 'new',
  USED = 'used',
}

/* The class `Product` represents a product entity with various properties such as id, seller, name,
description, condition, category, approval status, and creation date. */
@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Seller)
  seller: Seller;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ProductCondition, default: ProductCondition.NEW })
  condition: ProductCondition;

  @Column({ length: 100 })
  category: string;

  @Column({ default: false })
  approved: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
