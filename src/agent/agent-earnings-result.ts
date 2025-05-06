export interface AgentEarningsResult {
  agentId: string;
  totalEarned: number;
  last30Days: number;
  policiesSold: number;
  thirdPartyCount: number;
  thirdPartyCommission: number;
  comprehensiveCount: number;
  comprehensiveCommission: number;
}
