import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AgentService } from './agent.service';
import { sendSuccessResponse } from '../core/utils';

@Controller('agents')
export class AgentController {
  constructor(
    private readonly userService: UserService,
    private readonly agentService: AgentService,
  ) {}

  @Get(':agentId/earnings')
  async getAgentEarningsBreakdown(@Param('agentId') agentId: string) {
    console.log('agentId', agentId);
    const agent = await this.userService.findOne(agentId);
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    const result = await this.agentService.getAgentEarningsBreakdown(agentId);

    return sendSuccessResponse({ ...result }, 'Earnings breakdown retrieved');
  }
}
