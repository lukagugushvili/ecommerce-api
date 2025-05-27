import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './schema/category.schema';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { UpdateCategoryResponse } from './responses/update-category.response';
import { RemoveCategoryResponse } from './responses/remove-category.response';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => Category)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories' })
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Query(() => Category, { name: 'category' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Category> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid mongo ID');
    }

    return this.categoriesService.findOne(id);
  }

  @Mutation(() => UpdateCategoryResponse)
  async updateCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Promise<UpdateCategoryResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid mongo ID');
    }

    return this.categoriesService.update(id, updateCategoryInput);
  }

  @Mutation(() => RemoveCategoryResponse)
  async removeCategory(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<RemoveCategoryResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid mongo ID');
    }

    return this.categoriesService.remove(id);
  }
}
