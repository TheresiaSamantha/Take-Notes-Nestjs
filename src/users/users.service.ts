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

  async create(user: Partial<User>): Promise<User> {
    if (user.password) {
      user.password = await samar(user.password);
    }
    return this.userModel.create(user);
  }

  async update(id: number, user: Partial<User>): Promise<[number, User[]]> {
    return this.userModel.update(user, {
      where: { id },
      returning: true, // Return the updated record
    });
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (user) {
      await user.destroy();
    }
  }
}
