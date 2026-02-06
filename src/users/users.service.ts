import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { samar } from '../helpers/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll<User>();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async create(name: string, email: string, password: string): Promise<User> {
    if (password) {
      password = await samar(password);
    }
    return this.userModel.create({ name, email, password });
  }

  async login(id: number, user: Partial<User>): Promise<[number, User[]]> {
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
