import { SetMetadata } from '@nestjs/common';

/**
 * Roles Decorator
 * 
 * Purpose: Defines which roles are allowed to access a specific route or controller
 * 
 * How it works:
 * 1. Uses SetMetadata to store role requirements in route metadata
 * 2. RolesGuard reads this metadata to determine access permissions
 * 3. Supports multiple roles - user needs to match ANY of the specified roles
 * 
 * Usage Examples:
 * 
 * @Roles('admin')                    // Only admin users
 * @Roles('admin', 'seller')          // Admin OR seller users
 * @Roles('customer', 'admin')        // Customer OR admin users
 * 
 * Applied at method level:
 * @Get('sensitive-data')
 * @Roles('admin')
 * async getSensitiveData() { ... }
 * 
 * Applied at controller level (affects all routes in controller):
 * @Controller('admin')
 * @Roles('admin')
 * export class AdminController { ... }
 */

// Unique key used to store roles metadata
export const ROLES_KEY = 'roles';

/**
 * Decorator function that accepts one or more role strings
 * @param roles - Array of role strings that are allowed to access the route
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
