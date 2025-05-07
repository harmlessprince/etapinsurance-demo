import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './vehicle.model';
import { MODELS } from '../core/utils';
import { TestAppModule } from '../../test.module';
import { User } from '../user/user.model';

describe('VehicleService (Integration)', () => {
  let service: VehicleService;
  let createdUser: User;

  const vehicleDto = {
    plateNumber: 'ABC123XYZ',
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
      providers: [
        VehicleService,
        {
          provide: MODELS.VEHICLE_MODEL,
          useValue: Vehicle,
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    // Seed user
    createdUser = await User.create({
      username: 'jane@example.com',
    });
  });

  afterAll(async () => {
    await Vehicle.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  it('should create a vehicle if not exists', async () => {
    const vehicle = await service.getOrCreateVehicle(
      vehicleDto,
      createdUser?.id,
    );
    expect(vehicle).toBeDefined();
    expect(vehicle.plateNumber).toBe(vehicleDto.plateNumber);
    expect(vehicle.make).toBe(vehicleDto.make);
  });

  it('should return existing vehicle if already exists', async () => {
    const first = await service.getOrCreateVehicle(vehicleDto, createdUser.id);
    const second = await service.getOrCreateVehicle(vehicleDto, createdUser.id);

    expect(second.id).toBe(first.id);
  });

  it('should find a vehicle by plate number', async () => {
    const found = await service.findByPlateNumber(vehicleDto.plateNumber);
    expect(found).toBeDefined();
    expect(found?.plateNumber).toBe(vehicleDto.plateNumber);
  });
});
