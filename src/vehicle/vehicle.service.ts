import { Inject } from '@nestjs/common';
import { MODELS } from '../core/utils';
import { VehicleDto } from './vehicle.dto';
import { Vehicle } from './vehicle.model';
import { v4 as uuidv4 } from 'uuid';

export class VehicleService {
  constructor(
    @Inject(MODELS.VEHICLE_MODEL)
    private readonly vehicleRepository: typeof Vehicle,
  ) {}

  async getOrCreateVehicle(
    vehicleDto: VehicleDto,
    userId: string,
  ): Promise<Vehicle> {
    let vehicle = await this.findByPlateNumber(vehicleDto.plateNumber);
    if (!vehicle) {
      vehicle = await this.vehicleRepository.create({
        id: uuidv4(),
        userId: userId,
        plateNumber: vehicleDto.plateNumber,
        make: vehicleDto.make,
        model: vehicleDto.model,
        year: vehicleDto.year,
      });
    }
    return vehicle;
  }

  async findByPlateNumber(plateNumber: string) {
    return await this.vehicleRepository.findOne({
      where: {
        plateNumber: plateNumber,
      },
    });
  }
}
