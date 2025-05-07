import { Test, TestingModule } from '@nestjs/testing';
import { PolicyService } from './policy.service';
import { Policy } from './policy.model';
import { User } from '../user/user.model';
import { Vehicle } from '../vehicle/vehicle.model';
import { MODELS, PolicyType } from '../core/utils';
import { TestAppModule } from '../../test.module';
import { v4 as uuidv4 } from 'uuid';

describe('PolicyService (Integration)', () => {
  let service: PolicyService;
  let user: User;
  let agent: User;
  let vehicle: Vehicle;

  const vehicleDto = {
    id: uuidv4(),
    plateNumber: 'ABC123XYZ',
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    userId: '',
  };

  const baseDto = {
    vehicleValue: 1000000,
    vehiclePlateNumber: vehicleDto.plateNumber,
    vehicleMake: vehicleDto.make,
    vehicleModel: vehicleDto.model,
    vehicleYear: vehicleDto.year,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
      providers: [
        PolicyService,
        { provide: MODELS.POLICY_MODEL, useValue: Policy },
      ],
    }).compile();

    service = module.get<PolicyService>(PolicyService);

    agent = await User.create({
      username: 'agent_user',
    });

    user = await User.create({
      username: 'owner_user',
    });

    vehicleDto.userId = user.id;
    vehicle = await Vehicle.create(vehicleDto);
  });

  afterAll(async () => {
    try {
      await Policy.destroy({ where: {} });
      await Vehicle.destroy({ where: {} });
      await User.destroy({ where: {} });
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  });

  it('should create a COMPREHENSIVE policy with 5% premium', async () => {
    const dto = {
      ...baseDto,
      userId: user.id,
      agentId: agent.id,
      policyType: PolicyType.COMPREHENSIVE,
    };

    const policy = await service.createPolicy(dto, vehicle);

    expect(policy).toBeDefined();
    expect(policy.policyType).toBe(PolicyType.COMPREHENSIVE);
    expect(policy.premium).toBeCloseTo(0.05 * dto.vehicleValue);
    expect(policy.agentId).toBe(agent.id);
    expect(policy.userId).toBe(user.id);
    expect(policy.vehicleId).toBe(vehicle.id);
  });

  it('should create a THIRD_PARTY policy with flat premium', async () => {
    const dto = {
      ...baseDto,
      userId: user.id,
      agentId: agent.id,
      policyType: PolicyType.THIRD_PARTY,
    };

    const policy = await service.createPolicy(dto, vehicle);

    expect(policy).toBeDefined();
    expect(policy.policyType).toBe(PolicyType.THIRD_PARTY);
    expect(policy.premium).toBe(15000);
    expect(policy.agentId).toBe(agent.id);
    expect(policy.userId).toBe(user.id);
    expect(policy.vehicleId).toBe(vehicle.id);
  });

  it('should get all policies when no policyType is passed', async () => {
    const policies = await service.getAllPolicies();
    expect(Array.isArray(policies)).toBe(true);
    expect(policies.length).toBeGreaterThanOrEqual(2);
  });

  it('should get only COMPREHENSIVE policies when filtered', async () => {
    const policies = await service.getAllPolicies(PolicyType.COMPREHENSIVE);
    expect(Array.isArray(policies)).toBe(true);
    policies.forEach((policy) =>
      expect(policy.policyType).toBe(PolicyType.COMPREHENSIVE),
    );
  });
});
