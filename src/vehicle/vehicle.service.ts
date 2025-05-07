import { Inject } from '@nestjs/common';
import { MODELS } from '../core/utils';
import { VehicleDto } from './vehicle.dto';
import { Vehicle } from './vehicle.model';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service responsible for managing vehicle records.
 *
 * Capabilities:
 * - Retrieve a vehicle by plate number.
 * - Create a new vehicle record if one does not exist.
 */
export class VehicleService {
  constructor(
    @Inject(MODELS.VEHICLE_MODEL)
    private readonly vehicleRepository: typeof Vehicle,
  ) {}

  /**
   * Retrieves an existing vehicle by plate number, or creates one if it doesn't exist.
   *
   * This method is useful for ensuring vehicles are not duplicated in the system.
   * It checks if a vehicle with the given plate number exists. If it does, the vehicle is returned.
   * If not, a new vehicle record is created using the provided details.
   *
   * @param vehicleDto - The data transfer object containing vehicle information.
   * @param userId - The ID of the user who owns the vehicle.
   * @returns A promise resolving to the existing or newly created `Vehicle` instance.
   */
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

  /**
   * Finds a vehicle in the database using the plate number.
   *
   * @param plateNumber - The plate number of the vehicle to search for.
   * @returns A promise resolving to the matching `Vehicle` instance or `null` if not found.
   */
  async findByPlateNumber(plateNumber: string) {
    return await this.vehicleRepository.findOne({
      where: {
        plateNumber: plateNumber,
      },
    });
  }
}
