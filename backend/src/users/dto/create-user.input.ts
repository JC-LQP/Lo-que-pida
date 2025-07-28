import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { UserRole } from '../user.entity';

/* The `CreateUserInput` class in TypeScript defines input properties for creating a user, including
email, password, full name (optional), and role. */
@InputType()
export class CreateUserInput {
  @IsEmail()
  @Field()
  email: string;

  @MinLength(6)
  @Field()
  password: string;

  @Field({ nullable: true })
  fullName?: string;

  @IsEnum(UserRole)
  @Field(() => UserRole)
  role: UserRole;
}

