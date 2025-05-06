import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './create-policy.dto';
import { sendSuccessResponse } from '../core/utils';
import { UserService } from '../user/user.service';
import { CommissionService } from '../commissions/commission.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { VehicleDto } from '../vehicle/vehicle.dto';

@Controller('policy')
export class PolicyController {
  constructor(
    private readonly policyService: PolicyService,
    private readonly userService: UserService,
    private readonly commissionService: CommissionService,
    private readonly vehicleService: VehicleService,
  ) {}

  @Post()
  async create(@Body() createPolicyDto: CreatePolicyDto) {
    const { userId, policyType, agentId } = createPolicyDto;
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    const agent = await this.userService.findOne(agentId);
    if (!agent) {
      throw new NotFoundException('Agent does not exist');
    }
    const vehicleDto = new VehicleDto();
    vehicleDto.make = createPolicyDto.vehicleMake;
    vehicleDto.year = createPolicyDto.vehicleYear;
    vehicleDto.plateNumber = createPolicyDto.vehiclePlateNumber;
    vehicleDto.model = createPolicyDto.vehicleModel;

    const vehicle = await this.vehicleService.getOrCreateVehicle(
      vehicleDto,
      userId,
    );
    const policy = await this.policyService.createPolicy(
      createPolicyDto,
      vehicle,
    );

    const commission = await this.commissionService.createCommission(
      policyType,
      agentId,
      policy,
    );

    return sendSuccessResponse(
      {
        policyId: policy.policyNumber,
        premium: policy.premium,
        startDate: policy.startDate,
        endDate: policy.endDate,
        commission: commission.amount,
      },
      'Policy created successfully',
      201,
    );
  }

  @Get()
  async findAll(@Query('policyType') policyType?: string) {
    const policies = await this.policyService.getAllPolicies(policyType);
    return sendSuccessResponse(policies, 'Retrieved policies');
  }
}
