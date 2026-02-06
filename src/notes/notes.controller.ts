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
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './note.model';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async findAll(): Promise<Note[]> {
    return this.notesService.findAll();
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
}
