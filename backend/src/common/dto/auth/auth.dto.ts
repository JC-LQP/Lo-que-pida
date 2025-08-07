import { IsString, IsEmail, IsOptional, IsEnum, MinLength, IsBoolean } from 'class-validator';
import { UserRole } from '../../enums';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class VerifyTokenDto {
  @IsString()
  idToken: string;
}

export class SetUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}

export class CreateFirebaseUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;
}

export class UpdateFirebaseUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsBoolean()
  @IsOptional()
  disabled?: boolean;

  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;
}

export class AuthResponseDto {
  success: boolean;
  message?: string;
  user?: {
    uid: string;
    email: string;
    displayName?: string;
    emailVerified: boolean;
    role: UserRole;
  };
  token?: string;
}
