import { UserAuthEntity } from 'src/domain/auth/entities/user-auth.pstgs.entity';
import { DataSource } from 'typeorm';
export const authProviders = [
  {
    provide: 'USER_AUTH_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserAuthEntity),
    inject: ['DATA_SOURCE_POSTGRESQL'],
  },
];
