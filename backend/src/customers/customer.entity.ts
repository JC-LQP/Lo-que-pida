import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { User } from '../users/user.entity';
import { Address } from '../addresses/address.entity';


/* The Customer class represents a customer entity with properties such as id, user, country, postal
code, and addresses. */
@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 50 })
  country: string;

  @Column({ name: 'postal_code', length: 20 })
  postalCode: string;

  @OneToMany(() => Address, address => address.customer)
  addresses: Address[];
}
