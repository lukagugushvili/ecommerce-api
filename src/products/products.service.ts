import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './schema/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateProductResponse } from './responses/update-product.response';
import { RemoveProductResponse } from './responses/remove-product.response';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}
  async create(createProductInput: CreateProductInput): Promise<Product> {
    try {
      const createdProduct = await this.productModel.create(createProductInput);
      await createdProduct.save();

      return createdProduct;
    } catch (error) {
      console.error(`Error creating product: ${error.message}`);
      throw new BadRequestException(
        `Could not create product: ${error.message}`,
      );
    }
  }

  async findAllProduct(): Promise<Product[]> {
    const products = await this.productModel.find().populate('category').exec();

    if (!products || products.length === 0) {
      throw new NotFoundException('Products not found');
    }

    return products;
  }

  async findProductById(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('category')
      .exec();

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async updateProduct(
    id: string,
    updateProductInput: UpdateProductInput,
  ): Promise<UpdateProductResponse> {
    try {
      const updateProduct = await this.productModel
        .findByIdAndUpdate(id, updateProductInput, { new: true })
        .populate('category')
        .exec();

      if (!updateProduct) {
        throw new NotFoundException(`Product with ID: ${id} not found`);
      }

      return {
        message: 'Product updated successfully',
        product: updateProduct,
      };
    } catch (error) {
      console.error(`Error updating product: ${error.message}`);
      throw new BadRequestException(
        `Could not update product: ${error.message}`,
      );
    }
  }

  async removeProduct(id: string): Promise<RemoveProductResponse> {
    try {
      const removedProduct = await this.productModel
        .findByIdAndDelete(id)
        .exec();

      if (!removedProduct) {
        throw new NotFoundException(`Product with ID: "${id}" not found`);
      }

      return {
        message: 'Product removed successfully',
        product: removedProduct,
      };
    } catch (error) {
      console.error(`Error removing product: ${error.message}`);
      throw new BadRequestException(
        `Could not remove product: ${error.message}`,
      );
    }
  }
}
