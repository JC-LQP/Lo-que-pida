import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Order } from '../../orders/entities/order.entity';
import { Address } from '../../addresses/entities/address.entity';

@ObjectType()
@Entity({ name: 'shipping_info' })
export class ShippingInfo {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Order, { nullable: true })
  @OneToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Field(() => Address, { nullable: true })
  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Field()
  @Column({ name: 'shipping_method', length: 100 })
  shippingMethod: string;

  @Field({ nullable: true })
  @Column({ name: 'tracking_number', nullable: true })
  trackingNumber: string;

  @Field({ nullable: true })
  @Column({ name: 'carrier_name', nullable: true, length: 100 })
  carrierName: string;

  @Field({ nullable: true })
  @Column({ name: 'estimated_delivery_date', type: 'timestamp', nullable: true })
  estimatedDeliveryDate: Date;
}
