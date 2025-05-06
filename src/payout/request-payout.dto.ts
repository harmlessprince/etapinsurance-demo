import { IsUUID, IsNumber, Min } from 'class-validator';

export class RequestPayoutDto {
  @IsUUID()
  agentId: string;

  @IsNumber()
  @Min(10000, { message: 'Minimum payout amount is #10000' })
  amount: number;
}
