import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './infrastructure/interface/common/config/config';
import { AuthModule } from './application/auth/auth.module';
import { LoggerModule } from './infrastructure/interface/common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule,
    AuthModule,
  ],
})
export class AppModule {}
