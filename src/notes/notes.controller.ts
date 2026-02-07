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
  async getAllMyNotes(@Req() req: Request): Promise<Note[]> {
    // Hanya tampilkan notes milik user yang login
    return this.notesService.findByUser(req.userId as number);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Note | null> {
    const note = await this.notesService.findOne(+id);

    // Validasi: user hanya bisa lihat note miliknya sendiri
    if (note && note.userId !== req.userId) {
      throw new ForbiddenException('You can only view your own notes');
    }

    return note;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() note: Partial<Note>,
    @Req() req: Request,
  ): Promise<Note> {
    note.userId = req.userId;
    return this.notesService.create(note);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() note: Partial<Note>,
    @Req() req: Request,
  ): Promise<{ affected: number; data: Note[] }> {
    // Cek ownership: pastikan note milik user yang login
    const existingNote = await this.notesService.findOne(+id);
    if (!existingNote) {
      throw new ForbiddenException('Note not found');
    }
    if (existingNote.userId !== req.userId) {
      throw new ForbiddenException('You can only update your own notes');
    }

    const [affected, data] = await this.notesService.update(+id, note);
    return { affected, data };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: Request): Promise<void> {
    // Cek ownership: pastikan note milik user yang login
    const existingNote = await this.notesService.findOne(+id);
    if (!existingNote) {
      throw new ForbiddenException('Note not found');
    }
    if (existingNote.userId !== req.userId) {
      throw new ForbiddenException('You can only delete your own notes');
    }

    return this.notesService.remove(+id);
  }
}
