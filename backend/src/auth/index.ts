// Services
export { FirebaseAuthService, FirebaseUser } from './firebase-auth.service';

// Guards
export { FirebaseAuthGuard } from './guards/firebase-auth.guard';
export { RolesGuard, UserRole } from './guards/roles.guard';

// Decorators
export { CurrentUser } from './decorators/current-user.decorator';
export { Public } from './decorators/public.decorator';
export { Roles } from './decorators/roles.decorator';

// Controller
export { AuthController } from './auth.controller';

// Module
export { AuthModule } from './auth.module';
