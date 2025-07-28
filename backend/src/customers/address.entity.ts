import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

/* The Address class defines properties for storing information about a customer's address, including
recipient name, street address, city, province, country, postal code, phone number, and default
status. */
@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, customer => customer.addresses)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'recipient_name' })
  recipientName: string;

  @Column({ name: 'street_address' })
  streetAddress: string;

  @Column()
  city: string;

  @Column()
  province: string;

  @Column()
  country: string;

  @Column({ name: 'postal_code', nullable: true })
  postalCode: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;
}
