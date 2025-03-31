import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentResponse {
  @Field(() => String, { nullable: true })
  client_secret?: string;
}
