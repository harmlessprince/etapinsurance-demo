import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { InjectConnection } from '@nestjs/sequelize';
import { AgentEarningsResult } from './agent-earnings-result';

/**
 * Service responsible for managing agent-related operations.
 *
 * Capabilities:
 * - Retrieves detailed earnings breakdown for an agent, including total earnings,
 *   earnings over the last 30 days, and commissions based on different policy types.
 */
@Injectable()
export class AgentService {
  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Retrieves the earnings breakdown for a specific agent.
   *
   * This method computes the total earnings for an agent, earnings in the last 30 days,
   * the number of policies sold, and a detailed commission breakdown based on policy types.
   *
   * It returns a structured response including:
   * - Total earnings for the agent
   * - Earnings in the last 30 days
   * - Number of policies sold
   * - Breakdown of earnings for both third-party and comprehensive policies
   *
   * @param agentId - The unique identifier of the agent whose earnings are being queried.
   * @returns A promise resolving to an object containing the agent's earnings details.
   *          The object includes total earnings, earnings from the last 30 days,
   *          the count of policies sold, and a breakdown of third-party and comprehensive commissions.
   */
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
