import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreateAddressInput {
  @Field()
  @IsString()
  recipientName: string;

  @Field()
  @IsString()
  streetAddress: string;

  @Field()
  @IsString()
  city: string;

  @Field()
  @IsString()
  province: string;

  @Field()
  @IsString()
  country: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @Field()
  @IsString()
  customerId: string;
}
