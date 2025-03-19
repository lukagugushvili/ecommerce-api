import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  category: string;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @Field(() => [String])
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  images: string[];
}
