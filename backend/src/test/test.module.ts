import { Module } from '@nestjs/common';
import { TestController } from './test.controller'; // Re-enabled with all endpoints
import { TestSimpleController } from './test-simple.controller';
import { TestMinimalController } from './test-minimal.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [TestController, TestMinimalController, TestSimpleController],
})
export class TestModule {}
