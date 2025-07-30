import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { SellerStatus } from '../entities/seller.entity';

@InputType()
export class CreateSellerInput {
  @Field(() => String)
  @IsUUID()
  userId: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  storeDescription?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  storeLogo?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID()
  subscriptionId?: string;

  @Field(() => SellerStatus, { nullable: true })
  @IsOptional()
  @IsEnum(SellerStatus)
  status?: SellerStatus;
}
