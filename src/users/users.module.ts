import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [SequelizeModule.forFeature([User])], // Register the User model
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // If you want to use UsersService in other modules
})
export class UsersModule {}
