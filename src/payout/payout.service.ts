// payout.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { PayoutRequest } from './payout-requests.model';
import { RequestPayoutDto } from './request-payout.dto';
import { CommissionBalance } from './commission-balance.interface';
import { QueryTypes } from 'sequelize';

@Injectable()
export class PayoutService {
  constructor(
    @InjectModel(PayoutRequest)
    private readonly payoutModel: typeof PayoutRequest,
    private sequelize: Sequelize,
  ) {}

  async requestPayout(data: RequestPayoutDto) {
    // Calculate total available commission
    const result = await this.sequelize.query<CommissionBalance>(
      `
        SELECT 
          COALESCE(SUM(amount), 0) - (
            SELECT COALESCE(SUM(amount), 0)
            FROM payout_requests
            WHERE agent_id = :agentId AND status != 'rejected'
          ) AS available
        FROM commissions
        WHERE agent_id = :agentId
  `,
      {
        type: QueryTypes.SELECT,
        replacements: { agentId: data.agentId },
        plain: true,
      },
    );

    const available = result?.available || 0;

    if (data.amount > available) {
      throw new BadRequestException(
        `Requested amount ₦${data.amount} exceeds available balance ₦${available}`,
      );
    }

    return this.payoutModel.create({
      agentId: data.agentId,
      amount: data.amount,
      status: 'pending',
    });
  }
}
