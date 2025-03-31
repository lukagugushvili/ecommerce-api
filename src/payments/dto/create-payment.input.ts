import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreatePaymentInput {
  @Field()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  currency: string = 'usd';
}
