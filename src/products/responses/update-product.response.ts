import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from '../schema/product.schema';

@ObjectType()
export class UpdateProductResponse {
  @Field()
  message: string;

  @Field(() => Product)
  product: Product;
}
