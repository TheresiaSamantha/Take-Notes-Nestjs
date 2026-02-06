import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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
  async create(
    @Body() body: { name: string; email: string; password: string },
  ): Promise<{ message: string; data: User }> {
    const data = await this.usersService.create(
      body.name,
      body.email,
      body.password,
    );
    return { message: 'User baru berhasil dibuat', data };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.deleteUser(Number(id));
    return { message: 'User berhasil dihapus' };
  }
}
