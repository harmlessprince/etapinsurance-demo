import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { PolicyModule } from './policy/policy.module';
import { CommissionsModule } from './commissions/commissions.module';
import { PayoutModule } from './payout/payout.module';
import { APP_FILTER } from '@nestjs/core';
import { CatchEverythingFilter } from './core/filters/catch-everything-filter';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        models: [],
        autoLoadModels: true,
        synchronize: configService.get('NODE_ENV') == 'test',
        logging: false,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    VehicleModule,
    PolicyModule,
    CommissionsModule,
    PayoutModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
