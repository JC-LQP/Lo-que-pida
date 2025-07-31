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

import { Seller } from '../../sellers/entities/seller.entity';
import { Address } from '../../addresses/entities/address.entity';

@ObjectType()
@Entity({ name: 'warehouse' })
export class Warehouse {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Seller)
  @ManyToOne(() => Seller, (seller) => seller.warehouses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' })
  seller: Seller;

  @Field(() => Address)
  @ManyToOne(() => Address, { nullable: false })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Field()
  @Column({ length: 100 })
  name: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
