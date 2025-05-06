import {
  Column,
  Table,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table({ tableName: 'vehicles' })
export class Vehicle extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  declare userId: string;

  @Column({ field: 'plate_number' })
  declare plateNumber: string;

  @Column
  declare make: string;
  @Column
  declare model: string;
  @Column
  declare year: number;

  @Column({
    field: 'created_at',
  })
  declare createdAt?: Date;

  @Column({
    field: 'updated_at',
  })
  declare updatedAt?: Date;

  @BelongsTo(() => User) user: User;
}
