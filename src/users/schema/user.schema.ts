import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRoles } from 'src/enums/user-roles.enum';

@Schema({ timestamps: true })
@ObjectType()
export class User extends Document {
  @Field(() => ID)
  _id: string;

  @Prop({ enum: UserRoles, default: UserRoles.USER })
  @Field(() => UserRoles)
  role: UserRoles;

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
