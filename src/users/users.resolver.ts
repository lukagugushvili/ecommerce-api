import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './schema/user.schema';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.usersService.create(createUserInput);
  }
}
