import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { RegisterResponse } from './responses/register.response';
import { LoginResponse } from './responses/login.response';
import { LoginInput } from './dto/login.input';
import { User } from 'src/users/schema/user.schema';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterResponse, { name: 'register' })
  async register(
    @Args('registerUser') registerUser: CreateUserInput,
  ): Promise<RegisterResponse> {
    return this.authService.register(registerUser);
  }

  @Mutation(() => LoginResponse, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    return this.authService.login(loginInput);
  }
}
