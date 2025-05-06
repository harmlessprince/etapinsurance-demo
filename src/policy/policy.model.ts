import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Vehicle } from '../vehicle/vehicle.model';

@Table({ tableName: 'policies' })
export class Policy extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    allowNull: false,
    field: 'policy_number',
  })
  declare policyNumber: string;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  declare userId: string;

  @ForeignKey(() => Vehicle)
  @Column({ field: 'vehicle_id' })
  declare vehicleId: string;

  @ForeignKey(() => User)
  @Column({ field: 'agent_id' })
  declare agentId: string;

  @Column({ field: 'policy_type' })
  declare policyType: string;

  @Column
  declare premium: number;

  @Column({ field: 'start_date' })
  declare startDate: Date;

  @Column({ field: 'end_date' })
  declare endDate: Date;

  @Column({
    field: 'created_at',
  })
  declare createdAt?: Date;

  @Column({
    field: 'updated_at',
  })
  declare updatedAt?: Date;

  @BelongsTo(() => User, 'agentId')
  agent: User;

  @BelongsTo(() => User, 'userId')
  owner: User;

  @BelongsTo(() => Vehicle)
  vehicle: Vehicle;
}
