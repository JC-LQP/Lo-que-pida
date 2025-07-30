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
import { User } from '../../users/entities/user.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Product } from '../../products/entities/product.entity';

/**
 * Enum representing the status of a seller.
 */
export enum SellerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

@Entity({ name: 'sellers' })
export class Seller {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'store_name' })
  storeName: string;

  @Column({ name: 'store_description', nullable: true, type: 'text' })
  storeDescription?: string;

  @Column({ name: 'store_logo', nullable: true })
  storeLogo?: string;

  @ManyToOne(() => Subscription, { nullable: true })
  @JoinColumn({ name: 'subscription_id' })
  subscription?: Subscription;

  @Column({
    type: 'enum',
    enum: SellerStatus,
    default: SellerStatus.ACTIVE,
  })
  status: SellerStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];
}
