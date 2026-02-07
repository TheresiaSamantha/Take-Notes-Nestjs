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
    try {
      const data = await this.usersService.create(
        body.name,
        body.email,
        body.password,
      );
      if (!data) {
        throw new Error('Gagal membuat user baru');
      }
      return { message: 'User baru berhasil dibuat', data };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    console.log(id);

    await this.usersService.deleteUser(Number(id));
    return { message: 'User berhasil dihapus' };
  }
}
