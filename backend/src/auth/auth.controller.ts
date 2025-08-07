import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FirebaseAuthService, FirebaseUser } from './firebase-auth.service';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { RolesGuard, UserRole } from './guards/roles.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class AuthController {
  constructor(private firebaseAuthService: FirebaseAuthService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@CurrentUser() user: FirebaseUser) {
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        name: user.name,
        picture: user.picture,
        role: user.role,
      },
    };
  }

  @Get('verify-token')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@CurrentUser() user: FirebaseUser) {
    return {
      success: true,
      message: 'Token is valid',
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Post('create-user')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userData: {
    email: string;
    password: string;
    displayName?: string;
    role?: UserRole;
  }) {
    try {
      const userRecord = await this.firebaseAuthService.createUser(userData);
      
      // Set role as custom claim if provided
      if (userData.role) {
        await this.firebaseAuthService.setCustomUserClaims(userRecord.uid, {
          role: userData.role,
        });
      }

      return {
        success: true,
        message: 'User created successfully',
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Put('set-role/:uid')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async setUserRole(
    @Param('uid') uid: string,
    @Body() { role }: { role: UserRole },
  ) {
    try {
      await this.firebaseAuthService.setCustomUserClaims(uid, { role });
      
      return {
        success: true,
        message: `Role '${role}' assigned to user ${uid}`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('user/:uid')
  @Roles(UserRole.ADMIN)
  async getUserById(@Param('uid') uid: string) {
    try {
      const user = await this.firebaseAuthService.getUserById(uid);
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          disabled: user.disabled,
          customClaims: user.customClaims,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete('user/:uid')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('uid') uid: string) {
    try {
      await this.firebaseAuthService.deleteUser(uid);
      
      return {
        success: true,
        message: `User ${uid} deleted successfully`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Put('user/:uid')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('uid') uid: string,
    @Body() updateData: {
      email?: string;
      displayName?: string;
      disabled?: boolean;
    },
  ) {
    try {
      const userRecord = await this.firebaseAuthService.updateUser(uid, updateData);
      
      return {
        success: true,
        message: 'User updated successfully',
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified,
          disabled: userRecord.disabled,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Public endpoint for health check
  @Get('health')
  @Public()
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return {
      success: true,
      message: 'Auth service is running',
      timestamp: new Date().toISOString(),
    };
  }
}
