import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'warehouses' })
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  country: string;

  @Column({ length: 100 })
  city: string;
}
