// src/insurance-policy/dto/create-insurance-policy.dto.ts
import {
  IsEnum, IsInt,
  IsNotEmpty,
  IsNumber,
  IsString, Max,
  Min,
  MinLength,
} from 'class-validator';
import { PolicyType } from '../core/utils';

export class CreatePolicyDto {
  @IsString()
  @IsNotEmpty({ message: 'user id is required' })
  userId: string;

  @IsNotEmpty({ message: 'vehicle plate number is required' })
  @IsString()
  vehiclePlateNumber: string;

  @IsNotEmpty({ message: 'vehicle make is required' })
  @IsString()
  vehicleMake: string;

  @IsNotEmpty({ message: 'vehicle model is required' })
  @IsString()
  vehicleModel: string;

  @IsNotEmpty({ message: 'Vehicle year is required' })
  @IsInt({ message: 'Vehicle year must be an integer' })
  @Min(1900, { message: 'Vehicle year must be no earlier than 1900' })
  @Max(new Date().getFullYear(), { message: 'Vehicle year cannot be in the future' })
  vehicleYear: number;

  @IsNotEmpty({ message: 'policy type is required' })
  @IsEnum(PolicyType)
  policyType: PolicyType;

  @IsString()
  agentId: string;

  @Min(5000000, {
    message: 'vehicle value can not be lest than 5,000,000 naira',
  })
  @IsNumber()
  vehicleValue: number;
}
