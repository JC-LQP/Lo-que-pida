import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAuthService } from './firebase-auth.service';
import { AuthController } from './auth.controller';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [ConfigModule],
  providers: [
    FirebaseAuthService,
    FirebaseAuthGuard,
    RolesGuard,
  ],
  controllers: [AuthController],
  exports: [
    FirebaseAuthService,
    FirebaseAuthGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
