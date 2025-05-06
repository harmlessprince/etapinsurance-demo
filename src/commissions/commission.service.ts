import { Inject } from '@nestjs/common';
import { MODELS, PolicyType } from '../core/utils';
import { Commission } from './commission.model';
import { v4 as uuidv4 } from 'uuid';
import { Policy } from '../policy/policy.model';

export class CommissionService {
  constructor(
    @Inject(MODELS.COMMISSION_MODEL)
    private readonly commissionModel: typeof Commission,
  ) {}

  async createCommission(
    policyType: PolicyType,
    agentId: string,
    policy: Policy,
  ) {
    let commissionAmount = 0;
    if (policyType === PolicyType.COMPREHENSIVE) {
      commissionAmount = 0.15 * policy.premium;
    } else if (policyType === PolicyType.THIRD_PARTY) {
      commissionAmount = 0.1 * policy.premium;
    }
    return this.commissionModel.create({
      id: uuidv4(),
      agentId,
      policyId: policy.id,
      amount: commissionAmount,
    });
  }
}
