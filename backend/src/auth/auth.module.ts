import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    HttpModule,
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
