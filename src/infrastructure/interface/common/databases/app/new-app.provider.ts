import { AppEntity } from 'src/domain/app/entities/app-entity.pstgs.entity';
import { DataSource } from 'typeorm';

export const newAppProviders = [
  {
    provide: 'APP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(AppEntity),
    inject: ['DATA_SOURCE_POSTGRESQL'],
  },
];
