import { Module } from '@nestjs/common';
import { ShippingInfoService } from './shipping-info.service';
import { ShippingInfoController } from './shipping-info.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShippingInfoController],
  providers: [ShippingInfoService],
  exports: [ShippingInfoService],
})
export class ShippingInfoModule {}
