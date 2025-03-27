import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schema/cart.schema';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { ProductSchema } from 'src/products/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  providers: [CartService, CartResolver],
})
export class CartModule {}
