import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Policy } from './policy.model';
import { MODELS } from '../core/utils';
import { PolicyController } from './policy.controller';
import { VehicleModule } from '../vehicle/vehicle.module';
import { UserModule } from '../user/user.module';
import { CommissionsModule } from '../commissions/commissions.module';
import { PolicyService } from './policy.service';

@Module({
  controllers: [PolicyController],
  providers: [
    {
      provide: MODELS.POLICY_MODEL,
      useValue: Policy,
    },
    PolicyService,
  ],
  imports: [
    SequelizeModule.forFeature([Policy]),
    VehicleModule,
    UserModule,
    CommissionsModule,
  ],
})
export class PolicyModule {}
