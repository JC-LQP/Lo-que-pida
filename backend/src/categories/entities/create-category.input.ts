import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(0, 255)
  description?: string;
}
