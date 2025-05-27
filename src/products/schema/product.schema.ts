import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from 'src/categories/schema/category.schema';

@ObjectType()
@Schema({ timestamps: true })
export class Product extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  description: string;

  @Field(() => Int)
  @Prop({ required: true })
  price: number;

  @Field(() => Category, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category?: Types.ObjectId;

  @Field(() => Int)
  @Prop({ default: 0 })
  stock: number;

  @Field(() => [String])
  @Prop({ type: [String], default: [] })
  images: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
