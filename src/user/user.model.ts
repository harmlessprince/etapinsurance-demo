import {
  Column,
  Table,
  Model,
  DataType,
  HasMany,
  Index,
} from 'sequelize-typescript';
import { Vehicle } from '../vehicle/vehicle.model';
import { Policy } from '../policy/policy.model';
import { Commission } from '../commissions/commission.model';
import { PayoutRequest } from '../payout/payout-requests.model';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column
  @Index({ unique: true })
  declare username: string;

  @Column({ defaultValue: 'user' })
  @Index({ unique: false })
  declare role: string;

  @Column({
    field: 'created_at',
  })
  declare createdAt?: Date;

  @Column({
    field: 'updated_at',
  })
  declare updatedAt?: Date;

  @HasMany(() => Vehicle) vehicles: Vehicle[];
  @HasMany(() => Policy, 'agentId') policiesSold: Policy[];
  @HasMany(() => Commission) commissions: Commission[];
  @HasMany(() => PayoutRequest) payouts: PayoutRequest[];
}
