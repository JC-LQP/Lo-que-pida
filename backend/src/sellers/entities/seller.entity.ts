import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

export enum SellerSubscription {
  LOCAL = 'local',
  REGIONAL = 'regional',
  NATIONAL = 'national',
  INTERNATIONAL = 'international',
}

export enum SellerStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// GraphQL Enum registration
registerEnumType(SellerSubscription, {
  name: 'SellerSubscription',
  description: 'Subscription level of the seller',
});

registerEnumType(SellerStatus, {
  name: 'SellerStatus',
  description: 'Status of the seller account',
});

@ObjectType()
@Entity({ name: 'sellers' })
export class Seller {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field()
  @Column({ name: 'store_name', unique: true, length: 100 })
  storeName: string;

  @Field({ nullable: true })
  @Column({ name: 'tax_id', length: 50, nullable: true })
  taxId?: string;

  @Field({ nullable: true })
  @Column({ name: 'phone_number', length: 20, nullable: true })
  phoneNumber?: string;

  @Field(() => SellerSubscription, { nullable: true })
  @Column({ type: 'enum', enum: SellerSubscription, nullable: true })
  subscription?: SellerSubscription;

  @Field(() => SellerStatus)
  @Column({ type: 'enum', enum: SellerStatus, default: SellerStatus.PENDING })
  status: SellerStatus;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
