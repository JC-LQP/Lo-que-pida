import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { registerEnumType, ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Product } from '../../products/entities/product.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';

/**
 * Enum representing the status of a seller.
 */
export enum SellerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

registerEnumType(SellerStatus, {
  name: 'SellerStatus',
});

@ObjectType()
@Entity({ name: 'sellers' })
export class Seller {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field()
  @Column({ name: 'store_name' })
  storeName: string;

  @Field({ nullable: true })
  @Column({ name: 'store_description', nullable: true, type: 'text' })
  storeDescription?: string;

  @Field({ nullable: true })
  @Column({ name: 'store_logo', nullable: true })
  storeLogo?: string;

  @Field(() => Subscription, { nullable: true })
  @ManyToOne(() => Subscription, { nullable: true })
  @JoinColumn({ name: 'subscription_id' })
  subscription?: Subscription;

  @Field(() => SellerStatus)
  @Column({
    type: 'enum',
    enum: SellerStatus,
    default: SellerStatus.ACTIVE,
  })
  status: SellerStatus;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => [Product])
  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @Field(() => [Warehouse])
  @OneToMany(() => Warehouse, (warehouse) => warehouse.seller)
  warehouses: Warehouse[];
}
