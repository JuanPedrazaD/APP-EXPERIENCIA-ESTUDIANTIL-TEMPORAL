import { Module } from '@nestjs/common';
import { databaseProviders } from './databases.provider';
import { authProviders } from './auth/user.provider';

@Module({
  providers: [...databaseProviders, ...authProviders],
  exports: [...databaseProviders, ...authProviders],
})
export class DatabasesModule {}
