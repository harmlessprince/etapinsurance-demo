import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Vehicle } from './vehicle.model';
import { MODELS } from '../core/utils';
import { VehicleService } from './vehicle.service';

@Module({
  providers: [
    {
      provide: MODELS.VEHICLE_MODEL,
      useValue: Vehicle,
    },
    VehicleService,
  ],
  imports: [SequelizeModule.forFeature([Vehicle])],
  exports: [VehicleService],
})
export class VehicleModule {}
