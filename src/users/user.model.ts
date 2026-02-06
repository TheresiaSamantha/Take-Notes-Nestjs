// src/users/user.model.ts
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column
  declare name: string;

  @Column({ unique: true })
  declare email: string;

  @Column
  declare password: string;
}
