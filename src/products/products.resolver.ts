import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './schema/product.schema';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { UpdateProductResponse } from './responses/update-product.response';
import { RemoveProductResponse } from './responses/remove-product.response';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return this.productsService.create(createProductInput);
  }

  @Query(() => [Product], { name: 'products' })
  async findAllProduct(): Promise<Product[]> {
    return this.productsService.findAllProduct();
  }

  @Query(() => Product, { name: 'product' })
  async findProductById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid mongo ID');
    }
    return this.productsService.findProductById(id);
  }

  @Mutation(() => UpdateProductResponse)
  async updateProduct(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<UpdateProductResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid mongo ID');
    }

    return this.productsService.updateProduct(id, updateProductInput);
  }

  @Mutation(() => RemoveProductResponse)
  async removeProduct(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<RemoveProductResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid mongo ID');
    }

    return this.productsService.removeProduct(id);
  }
}
