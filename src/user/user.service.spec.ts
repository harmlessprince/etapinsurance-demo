import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MODELS } from '../core/utils';
import { NotFoundException } from '@nestjs/common';
import { TestAppModule } from '../../test.module';
import { User } from './user.model';

describe('UserService (Integration)', () => {
  let service: UserService;
  let createdUser: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
      providers: [
        UserService,
        {
          provide: MODELS.USER_MODEL,
          useValue: User,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    // Seed user
    createdUser = await User.create({
      username: 'jane@example.com',
    });
  });

  afterAll(async () => {
    await User.destroy({ where: {} });
  });

  it('should return a user by ID', async () => {
    const result = await service.findOne(createdUser.id);
    expect(result?.id).toBe(createdUser.id);
    expect(result?.username).toBe('jane@example.com');
  });

  it('should throw NotFoundException for non-existing user', async () => {
    await expect(service.findOne('non-existing-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
