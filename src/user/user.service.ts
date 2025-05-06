import { MODELS } from '../core/utils';
import { Inject, NotFoundException } from '@nestjs/common';
import { User } from './user.model';

export class UserService {
  constructor(
    @Inject(MODELS.USER_MODEL)
    private readonly userModel: typeof User,
  ) {}

  async findOne(id: string): Promise<User | null> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
