import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UserRoles } from 'src/enums/user-roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      const emailInUse = await this.userModel.findOne({
        email: createUserInput.email,
      });

      if (emailInUse) throw new BadRequestException('Email already exists');

      const user = await this.userModel.create({
        ...createUserInput,
        role: UserRoles.USER,
      });
      await user.save();

      return user;
    } catch (error) {
      console.error(`Error creating user: ${error.message}`);
      throw new BadRequestException('Could not create user');
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
