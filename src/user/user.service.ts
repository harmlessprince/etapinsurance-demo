import { MODELS } from '../core/utils';
import { Inject, NotFoundException } from '@nestjs/common';
import { User } from './user.model';

/**
 * Service responsible for user-related operations.
 *
 * Capabilities:
 * - Fetch a user by their unique identifier.
 */
export class UserService {
  constructor(
    @Inject(MODELS.USER_MODEL)
    private readonly userModel: typeof User,
  ) {}

  /**
   * Retrieves a user by their ID.
   *
   * @param id - The unique identifier of the user.
   * @returns The user instance if found.
   * @throws NotFoundException if the user does not exist.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
