import { DataSource } from 'typeorm';
import { UserGroupsEntity } from 'src/domain/notification/entity/user-groups.pstgs.entity';
import { NotificationHistoryEntity } from 'src/domain/notification/entity/notification-history.pstgs.entity';
import { SendHistoryEntity } from 'src/domain/notification/entity/send-history.pstgs.entity';
import { MailSendHistoryEntity } from 'src/domain/notification/entity/email/mail-send-history.pstgs.entity';

export const notificationProviders = [
  {
    provide: 'USER_GROUPS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserGroupsEntity),
    inject: ['DATA_SOURCE_POSTGRESQL'],
  },
  {
    provide: 'NOTIFICATION_HISTORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(NotificationHistoryEntity),
    inject: ['DATA_SOURCE_POSTGRESQL'],
  },
  {
    provide: 'SEND_HISTORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SendHistoryEntity),
    inject: ['DATA_SOURCE_POSTGRESQL'],
  },
  {
    provide: 'MAIL_SEND_HISTORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MailSendHistoryEntity),
    inject: ['DATA_SOURCE_POSTGRESQL'],
  },
];
