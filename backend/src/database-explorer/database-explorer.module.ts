import { Module } from '@nestjs/common';
import { DatabaseExplorerController } from './database-explorer.controller';
import { SchemaGeneratorService } from './schema-generator.service';
import { SchemaFileGeneratorService } from './schema-file-generator.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [DatabaseExplorerController],
  providers: [SchemaGeneratorService, SchemaFileGeneratorService],
  exports: [SchemaGeneratorService, SchemaFileGeneratorService],
})
export class DatabaseExplorerModule {}