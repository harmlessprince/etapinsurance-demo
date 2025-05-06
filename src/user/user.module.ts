import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MODELS } from '../core/utils';
import { User } from './user.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  providers: [
    UserService,
    {
      provide: MODELS.USER_MODEL,
      useValue: User,
    },
  ],
  exports: [UserService],
  imports: [SequelizeModule.forFeature([User])],
})
export class UserModule {}
