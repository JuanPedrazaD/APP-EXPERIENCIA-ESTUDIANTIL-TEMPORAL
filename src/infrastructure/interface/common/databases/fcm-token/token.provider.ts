import { DataSource } from 'typeorm';
import { FcmTokenEntity } from 'src/domain/fcm-token/entity/fcm-token.pstgs.entity';
import { UserInfoEntity } from 'src/domain/fcm-token/entity/user-info.oracle.entity';
import { DeviceTypeEntity } from 'src/domain/fcm-token/entity/device-type.pstgs.entity';

export const tokenProviders = [
  {
    provide: 'TOKEN_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(FcmTokenEntity),
    inject: ['DATA_SOURCE_POSTGRESQL'],
  },
  {
    provide: 'DEVICE_TYPE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(DeviceTypeEntity),
    inject: ['DATA_SOURCE_POSTGRESQL'],
  },
  {
    provide: 'USER_INFO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserInfoEntity),
    inject: ['DATA_SOURCE_ORACLE'],
  },
];
