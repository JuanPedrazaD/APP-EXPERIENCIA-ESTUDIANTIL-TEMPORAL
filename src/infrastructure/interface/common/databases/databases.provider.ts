import { ConfigService } from '@nestjs/config';
import { EnvInterface } from '../config/config';
import { DataSource } from 'typeorm';
import * as path from 'path';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE_POSTGRESQL',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dbConfig =
        configService.get<EnvInterface>('configuration')!.DB_POSTGRESQL;

      const dataSource = new DataSource({
        type: 'postgres',
        host: dbConfig.DBHOST,
        port: dbConfig.DBPORT,
        username: dbConfig.DBUSERNAME,
        password: dbConfig.DBPASSWORD,
        database: dbConfig.DBNAME,
        entities: [
          path.join(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'domain',
            '**',
            '*.pstgs.entity.{ts,js}',
          ),
        ],
        synchronize: false,
        logger: 'advanced-console',
        logging: dbConfig.LOGGER,
        extra: {
          trustServerCertificate: true,
        },
      });

      return dataSource.initialize();
    },
  },
];
