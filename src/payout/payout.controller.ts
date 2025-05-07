import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { sendSuccessResponse } from '../core/utils';
import { PayoutService } from './payout.service';
import { RequestPayoutDto } from './request-payout.dto';
import { PayoutRequest } from './payout-requests.model';

@Controller('payout')
export class PayoutController {
  constructor(
    private readonly userService: UserService,
    private readonly payoutService: PayoutService,
  ) {}

  @Post('request')
  async requestPayout(@Body() requestPayoutDto: RequestPayoutDto) {
    const agent = await this.userService.findOne(requestPayoutDto.agentId);
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    const payoutRequest: PayoutRequest =
      await this.payoutService.requestPayout(requestPayoutDto);
    return sendSuccessResponse(payoutRequest.get(), 'Request Submitted');
  }
}
