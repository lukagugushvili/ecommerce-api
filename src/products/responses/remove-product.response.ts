import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from '../schema/product.schema';

@ObjectType()
export class RemoveProductResponse {
  @Field()
  message: string;

  @Field(() => Product, { nullable: true })
  product?: Product;
}
