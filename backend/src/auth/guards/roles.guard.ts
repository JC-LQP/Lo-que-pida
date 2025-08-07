import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseUser } from '../firebase-auth.service';

export enum UserRole {
  CUSTOMER = 'customer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest();
    const user: FirebaseUser = request.user;

    if (!user) {
      this.logger.warn('User not found in request context');
      throw new ForbiddenException('User authentication required');
    }

    const userRole = user.role as UserRole;

    if (!userRole) {
      this.logger.warn(`User ${user.uid} has no role assigned`);
      throw new ForbiddenException('User role not assigned');
    }

    const hasRole = requiredRoles.includes(userRole);

    if (!hasRole) {
      this.logger.warn(
        `User ${user.uid} with role ${userRole} attempted to access resource requiring roles: ${requiredRoles.join(', ')}`,
      );
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    this.logger.log(`User ${user.uid} authorized with role ${userRole}`);
    return true;
  }
}
