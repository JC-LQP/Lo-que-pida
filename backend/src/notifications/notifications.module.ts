import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';

/* The NotificationsModule class is a TypeScript module that imports and exports TypeOrmModule with
Notification entity. */
@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  exports: [TypeOrmModule],
})
export class NotificationsModule {}
