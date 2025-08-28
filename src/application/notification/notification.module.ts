import { Module } from '@nestjs/common';
import { DatabasesModule } from 'src/infrastructure/interface/common/databases/databases.module';
import { NotificationController } from 'src/infrastructure/notification/notification.controller';
import { NotificationSendPort } from '../shared/port/notification-send.abstract';
import { FirebaseNotificationAdapter } from 'src/infrastructure/adapter/firebase-notification.adapter';
import { ShowGroupsService } from './show-growps.service';
import { SearchUserService } from './search-user.service';
import { GroupNotificationService } from './send-options/group-notification.service';
import { IndividualNotificationService } from './send-options/individual-notification.service';
import { HttpService } from '@nestjs/axios';
import { SaveNotificationService } from './save/save-notification.service';

@Module({
  providers: [
    ShowGroupsService,
    SearchUserService,
    GroupNotificationService,
    IndividualNotificationService,
    SaveNotificationService,
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
