import { IsString, IsEmail, IsOptional, IsEnum, IsDate, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserRole } from '../../enums';

export class CreateSupabaseUserDto {
  @IsString()
  firebaseUid: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;
}

export class UpdateSupabaseUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;
}

export class UserResponseDto {
  id: string;
  firebaseUid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  phoneNumber?: string;
  role: UserRole;
  emailVerified: boolean;
  
  @Type(() => Date)
  created_at: Date;
  
  @Type(() => Date)
  updated_at: Date;

  @Type(() => Date)
  last_sign_in?: Date;

  // Computed fields
  @Transform(({ obj }) => {
    if (obj.firstName && obj.lastName) {
      return `${obj.firstName} ${obj.lastName}`;
    }
    return obj.displayName || obj.email.split('@')[0];
  })
  fullName: string;
}

export class UserListResponseDto {
  users: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class UserFilterDto {
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  search?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  emailVerified?: boolean;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}
