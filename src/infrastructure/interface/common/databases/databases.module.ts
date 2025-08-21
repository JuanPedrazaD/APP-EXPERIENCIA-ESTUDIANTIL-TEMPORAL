import { Module } from '@nestjs/common';
import { databaseProviders } from './databases.provider';
import { authProviders } from './auth/user.provider';
import { newAppProviders } from './app/new-app.provider';

@Module({
  providers: [...databaseProviders, ...newAppProviders, ...authProviders],
  exports: [...databaseProviders, ...newAppProviders, ...authProviders],
})
export class DatabasesModule {}
