import { AppEntity } from 'src/domain/app/entity/app.pstgs.entity';
import { DataSource } from 'typeorm';

export const newAppProviders = [
  {
    provide: 'APP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(AppEntity),
    inject: ['DATA_SOURCE_POSTGRESQL'],
  },
];
