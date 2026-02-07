import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Note } from './note.model';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [SequelizeModule.forFeature([Note])],
  providers: [NotesService, AuthGuard],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
