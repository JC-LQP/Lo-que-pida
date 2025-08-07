# Firebase Authentication Module - Usage Examples

## Basic Usage

### 1. Protecting Routes with Authentication

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard, CurrentUser, FirebaseUser } from '../auth';

@Controller('protected')
@UseGuards(FirebaseAuthGuard)
export class ProtectedController {
  
  @Get('profile')
  getProfile(@CurrentUser() user: FirebaseUser) {
    return {
      message: `Hello ${user.name}!`,
      uid: user.uid,
      email: user.email,
    };
  }
}
```

### 2. Role-Based Access Control

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard, RolesGuard, Roles, UserRole, CurrentUser, FirebaseUser } from '../auth';

@Controller('admin')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class AdminController {
  
  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  adminDashboard(@CurrentUser() user: FirebaseUser) {
    return {
      message: 'Admin Dashboard',
      user: user.uid,
    };
  }

  @Get('seller-management')
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  sellerManagement() {
    return { message: 'Seller Management Panel' };
  }
}
```

### 3. Public Routes (No Authentication)

```typescript
import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth';

@Controller('public')
export class PublicController {
  
  @Get('products')
  @Public()
  getProducts() {
    return { message: 'Public product list' };
  }
}
```

### 4. Mixed Authentication (Some routes public, some protected)

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard, Public, CurrentUser, FirebaseUser } from '../auth';

@Controller('ecommerce')
@UseGuards(FirebaseAuthGuard) // Default protection for all routes
export class EcommerceController {
  
  @Get('products')
  @Public() // Override: Make this route public
  getProducts() {
    return { products: [] };
  }

  @Post('orders')
  // This route requires authentication (inherits from class)
  createOrder(@CurrentUser() user: FirebaseUser) {
    return {
      message: 'Order created',
      customerId: user.uid,
    };
  }
}
```

## Frontend Integration

### JavaScript/TypeScript Frontend

```javascript
// 1. User signs in with Firebase Auth
import { signInWithEmailAndPassword } from 'firebase/auth';

const { user } = await signInWithEmailAndPassword(auth, email, password);
const token = await user.getIdToken();

// 2. Use token in API requests
const response = await fetch('/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

## API Endpoints

The auth module provides these endpoints:

- `GET /auth/health` - Public health check
- `GET /auth/profile` - Get current user profile
- `GET /auth/verify-token` - Verify token validity
- `POST /auth/create-user` - Create new user (Admin only)
- `PUT /auth/set-role/:uid` - Set user role (Admin only)
- `GET /auth/user/:uid` - Get user by ID (Admin only)
- `PUT /auth/user/:uid` - Update user (Admin only)
- `DELETE /auth/user/:uid` - Delete user (Admin only)

## Environment Variables Required

Make sure these are set in your `.env` file:

```env
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Firebase-Private-Key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

## Error Handling

The module throws these exceptions:
- `UnauthorizedException` - Invalid or missing token
- `ForbiddenException` - Insufficient permissions/wrong role

## User Roles

- `customer` - Default role for regular users
- `seller` - For marketplace sellers
- `admin` - Full administrative access
