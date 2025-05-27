import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from '../schema/category.schema';

@ObjectType()
export class UpdateCategoryResponse {
  @Field()
  message: string;

  @Field(() => Category)
  category: Category;
}
