import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @IsEmail()
  @Field()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  fullName?: string;

  @IsEnum(UserRole)
  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  role?: UserRole;

  @Field({ nullable: true })
  @IsOptional()
  profileImage?: string;

  @Field({ nullable: true })
  @IsOptional()
  firebaseUid?: string;
}
