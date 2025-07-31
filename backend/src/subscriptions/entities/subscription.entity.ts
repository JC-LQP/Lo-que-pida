import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Seller } from '../../sellers/entities/seller.entity';
import { registerEnumType, ObjectType, Field, ID } from '@nestjs/graphql';

export enum SubscriptionPlan {
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

registerEnumType(SubscriptionPlan, {
  name: 'SubscriptionPlan',
});

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

registerEnumType(BillingCycle, {
  name: 'BillingCycle',
});

export enum PaidStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
}

registerEnumType(PaidStatus, {
  name: 'PaidStatus',
});

@ObjectType()
@Entity({ name: 'subscriptions' })
export class Subscription {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Seller)
  @ManyToOne(() => Seller, (seller) => seller.subscription, { onDelete: 'CASCADE' })
  seller: Seller;

  @Field(() => SubscriptionPlan)
  @Column({ type: 'enum', enum: SubscriptionPlan })
  plan: SubscriptionPlan;

  @Field(() => BillingCycle)
  @Column({ type: 'enum', enum: BillingCycle })
  billingCycle: BillingCycle;

  @Field(() => PaidStatus)
  @Column({ type: 'enum', enum: PaidStatus, default: PaidStatus.UNPAID })
  status: PaidStatus;

  @Field()
  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Field()
  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
