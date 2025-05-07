import { Inject } from '@nestjs/common';
import { MODELS, PolicyType } from '../core/utils';
import { CreatePolicyDto } from './create-policy.dto';
import { Vehicle } from '../vehicle/vehicle.model';
import { v4 as uuidv4 } from 'uuid';
import { Policy } from './policy.model';

/**
 * Service responsible for managing insurance policies.
 *
 * Capabilities:
 * - Create new insurance policies with premium calculation.
 * - Generate unique policy codes.
 * - Retrieve all policies, optionally filtered by type.
 */
export class PolicyService {
  constructor(
    @Inject(MODELS.POLICY_MODEL)
    private readonly policyModel: typeof Policy,
  ) {}

  /**
   * Creates a new insurance policy for a given vehicle.
   * Calculates the premium based on the vehicle value and policy type.
   *
   * @param createPolicyDto - Data transfer object containing policy creation details.
   * @param vehicle - The vehicle associated with the policy.
   * @returns The created Policy instance.
   */
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


  /**
   * Calculates the insurance premium based on policy type and vehicle value.
   *
   * @param policyType - The type of policy (e.g., COMPREHENSIVE or THIRD_PARTY).
   * @param vehicleValue - The declared value of the vehicle.
   * @returns The calculated premium amount.
   */
  private calculatePremium(policyType: PolicyType, vehicleValue: number) {
    let premium = 0;
    if (policyType === PolicyType.COMPREHENSIVE) {
      premium = 0.05 * vehicleValue;
    } else if (policyType === PolicyType.THIRD_PARTY) {
      premium = 15000; // flat rate for example
    }
    return premium;
  }

  /**
   * Generates a unique policy code using the current date and policy details.
   *
   * @param createPolicyDto - Data used to generate the policy code.
   * @returns A formatted unique policy code string.
   */
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


  /**
   * Retrieves all policies from the database.
   * Optionally filters by policy type.
   *
   * @param policyType - (Optional) Filter policies by type.
   * @returns A list of policies including associated vehicle, agent, and owner.
   */
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
