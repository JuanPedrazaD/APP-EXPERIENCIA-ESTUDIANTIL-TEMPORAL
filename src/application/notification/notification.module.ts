import { Module } from '@nestjs/common';
import { DatabasesModule } from 'src/infrastructure/interface/common/databases/databases.module';
import { NotificationController } from 'src/infrastructure/notification/notification.controller';
import { NotificationSendPort } from '../shared/port/notification-send.abstract';
import { FirebaseNotificationAdapter } from 'src/infrastructure/adapter/firebase-notification.adapter';
import { ShowGroupsService } from './user-groups/show-growps.service';
import { SearchUserService } from './user-groups/search-user.service';
import { GroupNotificationService } from './send-options/push-notification/group-notification.service';
import { IndividualNotificationService } from './send-options/push-notification/individual-notification.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SaveNotificationService } from './save-notification.service';
import { Login360Service } from './user-groups/360-requests/360-apis-login.service';
import { AdminValidationService } from './user-groups/360-requests/admin-validation.service';
import { StudentValidationService } from './user-groups/360-requests/student-validation.service';
import { SendEmailService } from './send-options/email/individual-email.service';
import { EmailHTMLTemplateService } from '../shared/email/email-template-html.service';
import { EmailSendPort } from '../shared/port/email-send.abstract';
import { zeptoMailAdapter } from 'src/infrastructure/adapter/zeptomail.adapter';
import { NotificationsByuserService } from './notifications-by-user.service';

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
    SendEmailService,
    EmailHTMLTemplateService,
    NotificationsByuserService,
    {
      provide: EmailSendPort,
      useClass: zeptoMailAdapter,
    },
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
