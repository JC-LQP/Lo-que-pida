import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Seller } from '../../sellers/entities/seller.entity';
import { Address } from '../../addresses/entities/address.entity';

@Entity('warehouse')
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Seller, (seller) => seller.warehouses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' })
  seller: Seller;

  @ManyToOne(() => Address, { nullable: false })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column()
  name: string;
}
