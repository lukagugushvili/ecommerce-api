import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from './schema/cart.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/products/schema/product.schema';
import { ClearCartResponse } from './responses/clear-cart.response';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async addToCart(userId: string, productId: string): Promise<Cart> {
    try {
      let cart = await this.cartModel.findOne({ user: userId });
      if (!cart) {
        cart = await this.cartModel.create({
          user: userId,
          products: [],
          totalPrice: 0,
        });
      }

      const product = await this.productModel.findById(productId);
      if (!product) throw new NotFoundException('Product not found');

      cart.products.push(new Types.ObjectId(productId));
      cart.totalPrice += product.price;
      await cart.save();

      await (
        await cart.populate({
          path: 'products',
          model: 'Product',
          select: 'name price description',
        })
      ).populate('user', 'email');

      return cart;
    } catch (error) {
      console.error(`Error adding to cart: ${error.message}`);
      throw new Error('Could not add to cart');
    }
  }

  async getCart(userId: string): Promise<Cart | null> {
    return await this.cartModel
      .findOne({ user: userId })
      .populate({
        path: 'products',
        model: 'Product',
        select: 'name price description',
      })
      .exec();
  }

  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    try {
      const cart = await this.cartModel.findOne({ user: userId });
      if (!cart) throw new NotFoundException('Cart not found');

      cart.products = cart.products.filter((id) => id.toString() !== productId);

      await cart.save();

      return cart;
    } catch (error) {
      console.error(`Error removing from cart: ${error.message}`);
      throw new Error('Could not remove from cart');
    }
  }

  async clearCart(userId: string): Promise<ClearCartResponse> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');

    if (cart.products.length === 0) {
      throw new NotFoundException('Cart is already empty');
    }

    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    return { message: 'Products removed from cart' };
  }
}
