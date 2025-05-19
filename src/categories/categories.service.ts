import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';
import { UpdateCategoryResponse } from './responses/update-category.response';
import { RemoveCategoryResponse } from './responses/remove-category.response';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}
  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    try {
      const category = await this.categoryModel.create(createCategoryInput);
      await category.save();

      return category;
    } catch (error) {
      console.error(`Error creating category: ${error.message}!`);
      throw new BadRequestException(
        `Could not create category: ${error.message}!`,
      );
    }
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.find().exec();

    if (!categories || categories.length === 0) {
      throw new NotFoundException('Categories not found!');
    }

    return categories;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();

    if (!category) throw new NotFoundException('Categories not found!');

    return category;
  }

  async update(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<UpdateCategoryResponse> {
    try {
      const updatedCategory = await this.categoryModel
        .findByIdAndUpdate(id, updateCategoryInput, { new: true })
        .exec();

      if (!updatedCategory) {
        throw new NotFoundException('Category not found!');
      }

      return {
        message: 'Category updated successfully',
        category: updatedCategory,
      };
    } catch (error) {
      console.error(`Error updating category: ${error.message}!`);
      throw new BadRequestException(
        `Could not update category: ${error.message} `,
      );
    }
  }

  async remove(id: string): Promise<RemoveCategoryResponse> {
    try {
      const category = await this.categoryModel.findByIdAndDelete(id).exec();

      if (!category) {
        throw new NotFoundException('Category not found!');
      }

      return {
        message: 'Category deleted successfully',
        category,
      };
    } catch (error) {
      console.error(`Error removing category: ${error.message}`);
      throw new BadRequestException(
        `Could not deleted category: ${error.message}`,
      );
    }
  }
}
