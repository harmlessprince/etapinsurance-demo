import { Inject } from '@nestjs/common';
import { MODELS, PolicyType } from '../core/utils';
import { User } from '../user/user.model';
import { CreatePolicyDto } from './create-policy.dto';
import { Vehicle } from '../vehicle/vehicle.model';
import { v4 as uuidv4 } from 'uuid';
import { Policy } from './policy.model';

export class PolicyService {
  constructor(
    @Inject(MODELS.POLICY_MODEL)
    private readonly policyModel: typeof Policy,
  ) {}

  async createPolicy(createPolicyDto: CreatePolicyDto, vehicle: Vehicle) {
    const premium = this.calculatePremium(
      createPolicyDto.policyType,
      createPolicyDto.vehicleValue,
    );
    return this.policyModel.create({
      id: uuidv4(),
      userId: createPolicyDto.userId,
      vehicleId: vehicle.id,
      policyType: createPolicyDto.policyType,
      agentId: createPolicyDto.agentId,
      policyNumber: this.generatePolicyCode(createPolicyDto),
      vehicleValue: createPolicyDto.vehicleValue,
      premium: premium,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1-year policy
    });
  }

  private calculatePremium(policyType: PolicyType, vehicleValue: number) {
    let premium = 0;
    if (policyType === PolicyType.COMPREHENSIVE) {
      premium = 0.05 * vehicleValue;
    } else if (policyType === PolicyType.THIRD_PARTY) {
      premium = 15000; // flat rate for example
    }
    return premium;
  }

  private generatePolicyCode(createPolicyDto: CreatePolicyDto): string {
    // Get the current date
    const date = new Date();

    // Extract the year, month, and day in the desired format
    const year = date.getFullYear();
    const month = date
      .toLocaleString('default', { month: 'short' })
      .toUpperCase(); // e.g., JAN
    const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits

    return `PLO-${year}-${month}-${day}-PL-${createPolicyDto?.vehiclePlateNumber}-PR-${createPolicyDto.policyType.toLocaleUpperCase()}`;
  }

  async getAllPolicies(policyType?: string) {
    const where: any = {};

    if (policyType) {
      where.policyType = policyType;
    }

    return this.policyModel.findAll({
      where,
      include: ['vehicle', 'agent', 'owner'],
      order: [['createdAt', 'DESC']],
    });
  }
}
