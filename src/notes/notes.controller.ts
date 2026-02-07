import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './note.model';
import { AuthGuard } from './guards/auth.guard';
import type { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  someProtectedRoute(@Req() req: Request) {
    return {
      message: `This is a protected route. Your user ID is ${req.userId}`,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Note | null> {
    return this.notesService.findOne(+id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<Note[]> {
    return this.notesService.findByUser(+userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() note: Partial<Note>): Promise<Note> {
    return this.notesService.create(note);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() note: Partial<Note>,
  ): Promise<{ affected: number; data: Note[] }> {
    const [affected, data] = await this.notesService.update(+id, note);
    return { affected, data };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.notesService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string, @Req() req: Request) {
    // Pastikan user hanya bisa hapus dirinya sendiri
    if (req.userId !== Number(id)) {
      throw new ForbiddenException('Cannot delete other user');
    }
    // ... rest of code
  }
}
