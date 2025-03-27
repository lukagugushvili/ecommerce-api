import { Args, Mutation, Resolver, Query, ID } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './schema/cart.schema';
import { ClearCartResponse } from './responses/clear-cart.response';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => Cart)
  async addToCart(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('productId', { type: () => ID }) productId: string,
  ): Promise<Cart> {
    return await this.cartService.addToCart(userId, productId);
  }

  @Query(() => Cart, { nullable: true })
  async getCart(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<Cart | null> {
    return await this.cartService.getCart(userId);
  }

  @Mutation(() => Cart)
  async removeFromCart(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('productId', { type: () => ID }) productId: string,
  ): Promise<Cart> {
    return await this.cartService.removeFromCart(userId, productId);
  }

  @Mutation(() => ClearCartResponse)
  async clearCart(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<ClearCartResponse> {
    return await this.cartService.clearCart(userId);
  }
}
