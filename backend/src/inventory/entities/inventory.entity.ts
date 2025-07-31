import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'inventory' })
export class Inventory {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.inventoryItems, { nullable: false })
  category: Category;

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, (product) => product.inventory)
  product: Product[];

  @Field()
  @Column('int')
  stock: number;

  @Field()
  @Column('int', { name: 'reserved_stock', default: 0 })
  reservedStock: number;

  @Field()
  @Column('int', { name: 'sold_stock', default: 0 })
  soldStock: number;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
