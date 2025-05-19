import { Int, Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentStatus } from 'src/enums/payment-status.enum';
import { OrderStatus } from 'src/enums/product-status.enum';
import { Product } from 'src/products/schema/product.schema';
import { User } from 'src/users/schema/user.schema';

@Schema({ timestamps: true })
@ObjectType()
export class Order extends Document {
  @Field(() => ID)
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Field(() => User)
  user: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Product', required: true })
  @Field(() => [Product])
  products: Types.ObjectId[];

  @Prop({ required: true, default: 0 })
  @Field(() => Int)
  totalPrice: number;

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING, required: true })
  @Field(() => OrderStatus)
  status: OrderStatus;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING, required: true })
  @Field(() => PaymentStatus)
  paymentStatus: PaymentStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
