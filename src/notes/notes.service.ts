import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Note } from './note.model';
import { User } from '../users/user.model';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note)
    private noteModel: typeof Note,
  ) {}

  async findAll(): Promise<Note[]> {
    return this.noteModel.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Note | null> {
    return this.noteModel.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }

  async findByUser(userId: number): Promise<Note[]> {
    return this.noteModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  async create(note: Partial<Note>): Promise<Note> {
    return this.noteModel.create(note);
  }

  async update(id: number, note: Partial<Note>): Promise<[number, Note[]]> {
    return this.noteModel.update(note, {
      where: { id },
      returning: true,
    });
  }

  async remove(id: number): Promise<void> {
    const note = await this.findOne(id);
    if (note) {
      await note.destroy();
    }
  }
}
