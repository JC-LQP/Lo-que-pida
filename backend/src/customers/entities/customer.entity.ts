import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

import { User } from '../../users/entities/user.entity';
import { Address } from '../../addresses/entities/address.entity';

@ObjectType()
@Entity({ name: 'customers' })
export class Customer {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field()
  @Column({ length: 50 })
  country: string;

  @Field()
  @Column({ name: 'postal_code', length: 20 })
  postalCode: string;

  @Field(() => [Address], { nullable: true })
  @OneToMany(() => Address, (address) => address.customer, { cascade: true })
  addresses?: Address[];

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
