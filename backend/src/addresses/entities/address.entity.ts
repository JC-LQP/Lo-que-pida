import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

import { Customer } from '../../customers/entities/customer.entity';

@ObjectType()
@Entity({ name: 'addresses' })
export class Address {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Customer)
  @ManyToOne(() => Customer, (customer) => customer.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Field()
  @Column({ name: 'recipient_name', length: 100 })
  recipientName: string;

  @Field()
  @Column({ name: 'street_address', length: 150 })
  streetAddress: string;

  @Field()
  @Column({ length: 50 })
  city: string;

  @Field()
  @Column({ length: 50 })
  province: string;

  @Field()
  @Column({ length: 50 })
  country: string;

  @Field({ nullable: true })
  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode?: string;

  @Field({ nullable: true })
  @Column({ name: 'phone_number', length: 20, nullable: true })
  phoneNumber?: string;

  @Field()
  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
