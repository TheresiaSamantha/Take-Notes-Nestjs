import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<{ message: string; data: User[] }> {
    const data = await this.usersService.findAll();
    return { message: 'Semua User', data };
  }

  @Post()
  create() {
    return { message: 'This endpoint will create a new user' };
  }
}
