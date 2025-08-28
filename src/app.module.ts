import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './infrastructure/interface/common/config/config';
import { AuthModule } from './application/auth/auth.module';
import { LoggerModule } from './infrastructure/interface/common/logger/logger.module';
import { CfmTokenModule } from './application/cfm-token/cfm-token.module';
import { NewAppModule } from './application/app/new-app.module';
import { NotificationModule } from './application/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule,
    AuthModule,
    CfmTokenModule,
    NewAppModule,
    NotificationModule,
  ],
})
export class AppModule {}
