import { DataSource } from 'typeorm';
import { UserGroupsEntity } from 'src/domain/notification/entity/user-groups.pstgs.entity';

export const notificationProviders = [
  {
    provide: 'USER_GROUPS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserGroupsEntity),
    inject: ['DATA_SOURCE_POSTGRESQL'],
  },
];
