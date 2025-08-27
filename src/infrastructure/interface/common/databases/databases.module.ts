import { Module } from '@nestjs/common';

import { authProviders } from './auth/user.provider';
import { databaseProviders } from './databases.provider';
import { newAppProviders } from './app/new-app.provider';
import { tokenProviders } from './fcm-token/token.provider';
import { notificationProviders } from './notification/notification.provider';

@Module({
  providers: [
    ...databaseProviders,
    ...newAppProviders,
    ...tokenProviders,
    ...notificationProviders,
    ...authProviders,
  ],
  exports: [
    ...databaseProviders,
    ...newAppProviders,
    ...tokenProviders,
    ...notificationProviders,
    ...authProviders,
  ],
})
export class DatabasesModule {}
