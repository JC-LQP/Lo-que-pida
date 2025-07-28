import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './address.entity';

/* The `AddressesModule` class is a module in TypeScript that imports the `Address` entity using
TypeORM and exports the TypeOrmModule. */
@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class AddressesModule {}
