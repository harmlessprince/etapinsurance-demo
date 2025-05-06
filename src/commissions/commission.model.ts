import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Policy } from '../policy/policy.model';

@Table({ tableName: 'commissions' })
export class Commission extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ field: 'agent_id' })
  declare agentId: string;

  @ForeignKey(() => Policy)
  @Column({ field: 'policy_id' })
  declare policyId: string;

  @Column
  declare amount: number;

  @Column({
    field: 'created_at',
  })
  declare createdAt?: Date;

  @Column({
    field: 'updated_at',
  })
  declare updatedAt?: Date;

  @BelongsTo(() => User) agent: User;
  @BelongsTo(() => Policy) policy: Policy;
}
