import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { SupabaseModule } from './supabase/supabase.module';
import { TestModule } from './test/test.module';
import { DatabaseExplorerModule } from './database-explorer/database-explorer.module';
import { AuthModule } from './auth/auth.module';
import { ExampleEcommerceController } from './example-ecommerce.controller';

// Debug database configuration
console.log('Supabase Database Configuration:');
console.log('SUPABASE_DB_HOST:', process.env.SUPABASE_DB_HOST);
console.log('SUPABASE_DB_PORT:', process.env.SUPABASE_DB_PORT);
console.log('SUPABASE_DB_NAME:', process.env.SUPABASE_DB_NAME);
console.log('SUPABASE_DB_PASSWORD:', process.env.SUPABASE_DB_PASSWORD ? '[REDACTED]' : 'undefined');
console.log('NODE_ENV:', process.env.NODE_ENV);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    SupabaseModule,
    TestModule,
    DatabaseExplorerModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    ExampleEcommerceController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
