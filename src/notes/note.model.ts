import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({
  tableName: 'Notes',
  underscored: true, // Convert camelCase to snake_case for DB columns
})
export class Note extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column
  declare title: string;

  @Column
  declare content: string;

  @ForeignKey(() => User)
  @Column
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @CreatedAt
  @Column
  declare createdAt: Date;

  @UpdatedAt
  @Column
  declare updatedAt: Date;
}
