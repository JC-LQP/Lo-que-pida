import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../common/decorators/roles.decorator';

/**
 * Roles Guard
 * 
 * Purpose: Implements role-based access control (RBAC)
 * 
 * How it works:
 * 1. Gets required roles from @Roles() decorator on the route/controller
 * 2. Gets user's role from the JWT payload (attached by JwtAuthGuard)
 * 3. Checks if user's role matches any of the required roles
 * 4. Allows/denies access based on role matching
 * 
 * Example usage:
 * @Roles('admin', 'seller')  // Only admins and sellers can access this route
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * async getSensitiveData() { ... }
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are specified, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get user from request (should be attached by JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('User information not found. Make sure JwtAuthGuard is applied first.');
    }

    // Check if user's role matches any of the required roles
    const hasRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRole) {
      throw new ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
