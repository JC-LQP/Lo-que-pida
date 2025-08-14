import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateSupabaseUserDto, UpdateSupabaseUserDto, UserFilterDto } from '../../common/dto/users/user.dto';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { FirebaseUser } from '../../auth/firebase-auth.service';
import { UserRole } from '../../auth/guards/roles.guard';

@Controller('api/users')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateSupabaseUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return {
        success: true,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query() filters: UserFilterDto,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const result = await this.usersService.findAll(
        filters,
        parseInt(page),
        parseInt(limit),
      );
      return {
        success: true,
        message: 'Users retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  async getUserStats() {
    try {
      const stats = await this.usersService.getUserStats();
      return {
        success: true,
        message: 'User statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: FirebaseUser) {
    try {
      const userProfile = await this.usersService.findByFirebaseUid(user.uid);
      return {
        success: true,
        message: 'User profile retrieved successfully',
        data: userProfile,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('by-email/:email')
  @Roles(UserRole.ADMIN)
  async findByEmail(@Param('email') email: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      return {
        success: true,
        message: user ? 'User found' : 'User not found',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('by-firebase-uid/:firebaseUid')
  @Roles(UserRole.ADMIN)
  async findByFirebaseUid(@Param('firebaseUid') firebaseUid: string) {
    try {
      const user = await this.usersService.findByFirebaseUid(firebaseUid);
      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: FirebaseUser,
    @Body() updateUserDto: UpdateSupabaseUserDto,
  ) {
    try {
      const existingUser = await this.usersService.findByFirebaseUid(user.uid);
      const updatedUser = await this.usersService.update(existingUser.id, updateUserDto);
      return {
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateSupabaseUserDto) {
    try {
      const user = await this.usersService.update(id, updateUserDto);
      return {
        success: true,
        message: 'User updated successfully',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    try {
      const result = await this.usersService.remove(id);
      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
