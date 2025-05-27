import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/products/schema/product.schema';
import { User } from 'src/users/schema/user.schema';

@Schema({ timestamps: true })
@ObjectType()
export class Cart extends Document {
  @Field(() => ID)
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Field(() => User)
  user: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Product', default: [] }])
  @Field(() => [Product])
  products: Types.ObjectId[];

  @Prop({ default: 0, required: true })
  @Field(() => Int)
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
