import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class User extends Document {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field()
  userName: string;

  @Prop({ required: true, unique: true })
  @Field()
  email: string;

  @Prop({ required: true })
  @Field()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
