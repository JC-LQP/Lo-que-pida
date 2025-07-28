import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';

/* The `PaymentsModule` class is a module in TypeScript that imports and exports the `TypeOrmModule`
for managing Payment entities. */
@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  exports: [TypeOrmModule],
})
export class PaymentsModule {}
