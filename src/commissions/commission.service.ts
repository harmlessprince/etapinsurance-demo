import { Inject, Injectable } from '@nestjs/common';
import { MODELS, PolicyType } from '../core/utils';
import { Commission } from './commission.model';
import { v4 as uuidv4 } from 'uuid';
import { Policy } from '../policy/policy.model';

/**
 * Service responsible for handling commission-related operations.
 *
 * Capabilities:
 * - Creates a commission record for an agent based on the policy type (Comprehensive or Third-Party).
 * - Calculates the commission based on the premium of the policy.
 */
@Injectable()
export class CommissionService {
  constructor(
    @Inject(MODELS.COMMISSION_MODEL)
    private readonly commissionModel: typeof Commission,
  ) {}

  /**
   * Creates a commission record for an agent based on the policy type and policy details.
   *
   * This method calculates the commission amount based on the policy type:
   * - 15% of the policy premium for 'COMPREHENSIVE' policies
   * - 10% of the policy premium for 'THIRD_PARTY' policies
   *
   * After calculating the commission, it creates a commission record associated with the given agent and policy.
   *
   * @param policyType - The type of policy that the commission is based on (Comprehensive or Third-Party).
   * @param agentId - The ID of the agent who is being awarded the commission.
   * @param policy - The policy object that the commission is associated with.
   * @returns A promise that resolves to the created commission record.
   */
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
