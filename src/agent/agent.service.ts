import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { InjectConnection } from '@nestjs/sequelize';
import { AgentEarningsResult } from './agent-earnings-result';

@Injectable()
export class AgentService {
  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async getAgentEarningsBreakdown(agentId: string) {
    const [result] = await this.sequelize.query<AgentEarningsResult>(
      `
      SELECT 
        c."agent_id" AS "agentId",
        COALESCE(SUM(c.amount), 0) AS "totalEarned",
        COALESCE(SUM(CASE WHEN c."created_at" >= NOW() - INTERVAL '30 days' THEN c.amount ELSE 0 END), 0) AS "last30Days",
        COUNT(DISTINCT p.id) AS "policiesSold",
        COUNT(CASE WHEN p.policy_type = 'third_party' THEN 1 END) AS "thirdPartyCount",
        COALESCE(SUM(CASE WHEN p.policy_type = 'third_party' THEN c.amount ELSE 0 END), 0) AS "thirdPartyCommission",
        COUNT(CASE WHEN p.policy_type = 'comprehensive' THEN 1 END) AS "comprehensiveCount",
        COALESCE(SUM(CASE WHEN p.policy_type = 'comprehensive' THEN c.amount ELSE 0 END), 0) AS "comprehensiveCommission"
      FROM commissions c
      LEFT JOIN policies p ON c.policy_id = p.id
      WHERE c.agent_id = :agentId
      GROUP BY c.agent_id
      `,
      {
        replacements: { agentId },
        type: QueryTypes.SELECT,
      },
    );

    // Ensure defaults if no result
    return {
      agentId,
      totalEarned: result?.totalEarned ?? 0,
      last30Days: result?.last30Days ?? 0,
      policiesSold: result?.policiesSold ?? 0,
      breakdown: {
        thirdParty: {
          count: result?.thirdPartyCount ?? 0,
          commission: result?.thirdPartyCommission ?? 0,
        },
        comprehensive: {
          count: result?.comprehensiveCount ?? 0,
          commission: result?.comprehensiveCommission ?? 0,
        },
      },
    };
  }
}
