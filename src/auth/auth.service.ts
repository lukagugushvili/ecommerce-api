import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterResponse } from './responses/register.response';
import { LoginInput } from './dto/login.input';
import { LoginResponse } from './responses/login.response';
import { User } from 'src/users/schema/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUser: CreateUserInput): Promise<RegisterResponse> {
    const { password } = registerUser;
    try {
      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const registered = await this.userService.create({
        ...registerUser,
        password: hashedPassword,
      });

      return { message: 'Registration successfully', ID: registered.id };
    } catch (error) {
      console.error(`Error registering user: ${error.message}!`);
      throw new BadRequestException(
        `Could not register user: ${error.message}!`,
      );
    }
  }

  async login(loginInput: LoginInput): Promise<LoginResponse> {
    const { email, password } = loginInput;
    try {
      const user = await this.userService.findUserByEmail(email);
      if (!user) throw new UnauthorizedException('Invalid credentials!');

      const isPasswordsEqual = await bcrypt.compare(password, user.password);
      if (!isPasswordsEqual) {
        throw new UnauthorizedException('Invalid credentials!');
      }

      const payload = { sub: user.id, email, role: user.role };
      const access_token = this.jwtService.sign(payload);

      return {
        message: 'Logged in successfully',
        access_token,
      };
    } catch (error) {
      console.error(`Login error: ${error.message}!`);
      throw new BadRequestException(
        `Login failed. please check your credentials: ${error.message}!`,
      );
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) return null;

    const arePasswordsEqual = await bcrypt.compare(password, user.password);
    if (!arePasswordsEqual) return null;

    return user;
  }
}
