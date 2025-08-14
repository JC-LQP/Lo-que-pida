import { Module } from '@nestjs/common';
import { BestBuyService } from './bestbuy.service';
import { BestBuyController } from './bestbuy.controller';

@Module({
  providers: [BestBuyService],
  controllers: [BestBuyController],
  exports: [BestBuyService],
})
export class BestBuyModule {}
