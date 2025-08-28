import { Module } from '@nestjs/common';
import { DatabasesModule } from 'src/infrastructure/interface/common/databases/databases.module';
import { NotificationController } from 'src/infrastructure/notification/notification.controller';
import { NotificationSendPort } from '../shared/port/notification-send.abstract';
import { FirebaseNotificationAdapter } from 'src/infrastructure/adapter/firebase-notification.adapter';

@Module({
  providers: [
    {
      provide: NotificationSendPort,
      useClass: FirebaseNotificationAdapter,
    },
  ],
  controllers: [NotificationController],
  imports: [DatabasesModule],
  exports: [],
})
export class NotificationModule {}
