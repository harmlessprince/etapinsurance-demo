import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { UserModule } from '../user/user.module';
import { AgentService } from './agent.service';

@Module({
  imports: [UserModule],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
