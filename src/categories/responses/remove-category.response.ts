import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from '../schema/category.schema';

@ObjectType()
export class RemoveCategoryResponse {
  @Field()
  message: string;

  @Field(() => Category)
  category: Category;
}
