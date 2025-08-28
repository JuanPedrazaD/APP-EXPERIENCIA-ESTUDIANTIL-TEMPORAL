import { Module } from '@nestjs/common';
import { DatabasesModule } from 'src/infrastructure/interface/common/databases/databases.module';
import { NotificationController } from 'src/infrastructure/notification/notification.controller';
import { NotificationSendPort } from '../shared/port/notification-send.abstract';
import { FirebaseNotificationAdapter } from 'src/infrastructure/adapter/firebase-notification.adapter';
import { ShowGroupsService } from './groups/show-growps.service';
import { SearchUserService } from './groups/search-user.service';
import { GroupNotificationService } from './send-options/group-notification.service';
import { IndividualNotificationService } from './send-options/individual-notification.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SaveNotificationService } from './save/save-notification.service';
import { Login360Service } from './groups/360-requests/360-apis-login.service';
import { AdminValidationService } from './groups/360-requests/admin-validation.service';
import { StudentValidationService } from './groups/360-requests/student-validation.service';

@Module({
  providers: [
    ShowGroupsService,
    SearchUserService,
    GroupNotificationService,
    IndividualNotificationService,
    SaveNotificationService,
    Login360Service,
    AdminValidationService,
    StudentValidationService,
    {
      provide: NotificationSendPort,
      useClass: FirebaseNotificationAdapter,
    },
  ],
  controllers: [NotificationController],
  imports: [
    DatabasesModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  exports: [],
})
export class NotificationModule {}
