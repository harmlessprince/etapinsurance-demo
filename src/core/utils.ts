import { SuccessResponseDTO } from './responseDTO';

export enum PolicyType {
  THIRD_PARTY = 'third_party',
  COMPREHENSIVE = 'comprehensive',
}

export enum MODELS {
  USER_MODEL = 'USER_MODEL',
  COMMISSION_MODEL = 'COMMISSION_MODEL',
  PAYOUT_MODEL = 'PAYOUT_MODEL',
  VEHICLE_MODEL = 'VEHICLE_MODEL',
  POLICY_MODEL = 'POLICY_MODEL',
}

export const sendSuccessResponse = (
  data: any = null,
  message: string = 'Action successful',
  statusCode = 200,
): SuccessResponseDTO => {
  return {
    success: true,
    message,
    data: data,
    statusCode: statusCode,
  };
};
