import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ClearCartResponse {
  @Field()
  message: string;
}
