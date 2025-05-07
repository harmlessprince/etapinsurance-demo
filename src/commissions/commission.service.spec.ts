import { Test, TestingModule } from '@nestjs/testing';
import { CommissionService } from './commission.service';
import { Commission } from './commission.model';
import { Policy } from '../policy/policy.model';
import { MODELS, PolicyType } from '../core/utils';
import { TestAppModule } from '../../test.module';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/user.model';
import { Vehicle } from '../vehicle/vehicle.model';

describe('CommissionService (Integration)', () => {
  let service: CommissionService;
  let policyComprehensive: Policy;
  let policyThirdParty: Policy;
  let user: User;
  let agent: User;
  let vehicle: Vehicle;

  const mockPolicyComprehensive = {
    id: uuidv4(),
    premium: 20000,
    policyNumber: 'POL123',
    userId: uuidv4(),
    vehicleId: uuidv4(),
    agentId: uuidv4(),
    policyType: PolicyType.COMPREHENSIVE,
    startDate: new Date(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };

  const mockPolicyThirdParty = {
    id: uuidv4(),
    premium: 20000,
    policyNumber: 'POL1234',
    userId: uuidv4(),
    vehicleId: uuidv4(),
    agentId: uuidv4(),
    policyType: PolicyType.THIRD_PARTY,
    startDate: new Date(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };

  const vehicleDto = {
    id: uuidv4(),
    plateNumber: 'ABC123XYZ',
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    userId: '',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
      providers: [
        CommissionService,
        { provide: MODELS.COMMISSION_MODEL, useValue: Commission },
      ],
    }).compile();

    service = module.get<CommissionService>(CommissionService);

    agent = await User.create({
      username: 'agent',
    });
    user = await User.create({
      username: 'user',
    });

    vehicleDto.userId = user.id;
    vehicle = await Vehicle.create(vehicleDto);

    mockPolicyComprehensive.userId = vehicleDto.userId;
    mockPolicyComprehensive.agentId = agent.id;
    mockPolicyComprehensive.vehicleId = vehicle.id;

    mockPolicyThirdParty.userId = vehicleDto.userId;
    mockPolicyThirdParty.vehicleId = vehicle.id;
    mockPolicyThirdParty.agentId = agent.id;

    policyComprehensive = await Policy.create(mockPolicyComprehensive);
    policyThirdParty = await Policy.create(mockPolicyThirdParty);
  });

  afterAll(async () => {
    try {
      await Commission.destroy({ where: {} });
      await Policy.destroy({ where: {} });
      await Vehicle.destroy({ where: {} });
      await User.destroy({ where: {} });
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  });

  it('should create a commission for COMPREHENSIVE policy', async () => {
    const commission = await service.createCommission(
      PolicyType.COMPREHENSIVE,
      agent.id,
      policyComprehensive,
    );
    expect(commission).toBeDefined();
    expect(commission.amount).toBeCloseTo(0.15 * policyComprehensive.premium);
    expect(commission.agentId).toBe(agent.id);
    expect(commission.policyId).toBe(policyComprehensive.id);
  });

  it('should create a commission for THIRD_PARTY policy', async () => {
    const commission = await service.createCommission(
      PolicyType.THIRD_PARTY,
      agent.id,
      policyThirdParty,
    );
    expect(commission).toBeDefined();
    expect(commission.amount).toBeCloseTo(0.1 * policyThirdParty.premium);
    expect(commission.agentId).toBe(agent.id);
    expect(commission.policyId).toBe(policyThirdParty.id);
  });
});
