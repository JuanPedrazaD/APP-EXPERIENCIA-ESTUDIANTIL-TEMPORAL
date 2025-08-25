import { Module } from '@nestjs/common';
import { databaseProviders } from './databases.provider';
import { authProviders } from './auth/user.provider';
import { newAppProviders } from './app/new-app.provider';
import { tokenProviders } from './fcm-token/token.provider';

@Module({
  providers: [
    ...databaseProviders,
    ...newAppProviders,
    ...tokenProviders,
    ...authProviders,
  ],
  exports: [
    ...databaseProviders,
    ...newAppProviders,
    ...tokenProviders,
    ...authProviders,
  ],
})
export class DatabasesModule {}
