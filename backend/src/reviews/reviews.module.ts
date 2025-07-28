import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';

/* The ReviewsModule class is a module in TypeScript that imports and exports TypeOrmModule for
managing Review entities. */
@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  exports: [TypeOrmModule],
})
export class ReviewsModule {}
