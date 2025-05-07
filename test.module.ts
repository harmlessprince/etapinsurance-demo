import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './src/user/user.model';
import { Policy } from './src/policy/policy.model';
import { Commission } from './src/commissions/commission.model';
import { PayoutRequest } from './src/payout/payout-requests.model';
import { Vehicle } from './src/vehicle/vehicle.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: ':memory:', // Use in-memory database
      autoLoadModels: true,
      synchronize: true, // Automatically sync models
      logging: false,
    }),
    SequelizeModule.forFeature([
      User,
      Vehicle,
      Policy,
      Commission,
      PayoutRequest,
    ]),
  ],
})
export class TestAppModule {}
