import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Product } from './product.entity';

import { Warehouse } from '../warehouses/warehouse.entity';

/* The Inventory class represents the quantity of a specific product in a warehouse in a TypeScript
application. */
@Entity({ name: 'inventory' })
export class Inventory {
  @PrimaryColumn('uuid')
  productId: string;

  @PrimaryColumn('uuid')
  warehouseId: string;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => Warehouse)
  warehouse: Warehouse;

  @Column({ type: 'int', default: 0 })
  quantity: number;
}
