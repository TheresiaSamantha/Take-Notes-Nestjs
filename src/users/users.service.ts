import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { samar, match } from '../helpers/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll<User>();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async create(name: string, email: string, password: string): Promise<User> {
    const emailExists = await this.userModel.findOne({ where: { email } });
    if (emailExists) {
      throw new BadRequestException('Email sudah terdaftar');
    }
    if (password) {
      password = await samar(password);
    }
    return this.userModel.create({ name, email, password });
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    //Find user by email
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }
    //Compare entered password with stored hashed password
    const passwordMatch = await match(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // Generate JWT token
    return this.generateUserTokens(user.id);
  }

  generateUserTokens(userId: number): { accessToken: string } {
    const accessToken = this.jwtService.sign({ userId });
    return { accessToken };
  }

  async update(id: number, user: Partial<User>): Promise<[number, User[]]> {
    return this.userModel.update(user, {
      where: { id },
      returning: true, // Return the updated record
    });
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (user) {
      await user.destroy();
    }
  }
}
