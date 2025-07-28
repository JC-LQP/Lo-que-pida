import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../users/user.entity';

/* The `export enum SellerSubscription` is defining an enumeration (enum) in TypeScript for the
possible subscription levels that a seller entity can have. In this case, the `SellerSubscription`
enum has four possible values: `LOCAL`, `REGIONAL`, `NATIONAL`, and `INTERNATIONAL`, each with a
corresponding string value of `'local'`, `'regional'`, `'national'`, and `'international'`
respectively. Enums in TypeScript provide a way to define a set of named constants, making the code
more readable and maintainable by giving meaningful names to values. */
export enum SellerSubscription {
  LOCAL = 'local',
  REGIONAL = 'regional',
  NATIONAL = 'national',
  INTERNATIONAL = 'international',
}

/* The `export enum SellerStatus` is defining an enumeration (enum) in TypeScript for the possible
status values of a seller entity. In this case, the `SellerStatus` enum has three possible values:
`PENDING`, `APPROVED`, and `REJECTED`, each with a corresponding string value of `'pending'`,
`'approved'`, and `'rejected'` respectively. */
export enum SellerStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/* The Seller class defines properties for a seller entity with details such as store name, tax ID,
phone number, subscription status, and seller status. */
@Entity({ name: 'sellers' })
export class Seller {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'store_name', unique: true, length: 100 })
  storeName: string;

  @Column({ name: 'tax_id', length: 50, nullable: true })
  taxId?: string;

  @Column({ name: 'phone_number', length: 20, nullable: true })
  phoneNumber?: string;

  @Column({ type: 'enum', enum: SellerSubscription, nullable: true })
  subscription?: SellerSubscription;

  @Column({ type: 'enum', enum: SellerStatus, default: SellerStatus.PENDING })
  status: SellerStatus;
}
