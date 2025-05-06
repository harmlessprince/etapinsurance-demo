import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Commission } from './commission.model';
import { MODELS } from '../core/utils';
import { CommissionService } from './commission.service';

@Module({
  providers: [
    {
      provide: MODELS.COMMISSION_MODEL,
      useValue: Commission,
    },
    CommissionService,
  ],
  imports: [SequelizeModule.forFeature([Commission])],
  exports: [CommissionService],
})
export class CommissionsModule {}
