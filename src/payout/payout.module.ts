import { Module } from '@nestjs/common';
import { MODELS } from '../core/utils';
import { PayoutRequest } from './payout-requests.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { PayoutService } from './payout.service';
import { PayoutController } from './payout.controller';
import { UserModule } from '../user/user.module';

@Module({
  providers: [
    {
      provide: MODELS.PAYOUT_MODEL,
      useValue: PayoutRequest,
    },
    PayoutService,
  ],
  imports: [SequelizeModule.forFeature([PayoutRequest]), UserModule],
  controllers: [PayoutController],
})
export class PayoutModule {}
