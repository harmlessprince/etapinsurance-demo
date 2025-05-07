import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table({ tableName: 'payout_requests' })
export class PayoutRequest extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ field: 'agent_id' })
  declare agentId: string;

  @Column
  declare amount: number;
  @Column
  declare status: string;

  @Column({
    field: 'created_at',
  })
  declare createdAt?: Date;

  @Column({
    field: 'updated_at',
  })
  declare updatedAt?: Date;

  @Column({ field: 'requested_at' })
  declare requestedAt: Date;

  @Column({ field: 'reviewed_at' })
  declare reviewedAt: Date;

  @BelongsTo(() => User)
  agent: User;
}
