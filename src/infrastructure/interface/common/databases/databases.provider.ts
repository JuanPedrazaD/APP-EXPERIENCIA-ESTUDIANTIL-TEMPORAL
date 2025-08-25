import { ConfigService } from '@nestjs/config';
import { EnvInterface } from '../config/config';
import { DataSource } from 'typeorm';
import * as path from 'path';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE_POSTGRESQL',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dbConfigPostgreSQL =
        configService.get<EnvInterface>('configuration')!.DB_POSTGRESQL;

      const dataSource = new DataSource({
        type: 'postgres',
        host: dbConfigPostgreSQL.DBHOST,
        port: dbConfigPostgreSQL.DBPORT,
        username: dbConfigPostgreSQL.DBUSERNAME,
        password: dbConfigPostgreSQL.DBPASSWORD,
        database: dbConfigPostgreSQL.DBNAME,
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
        logging: dbConfigPostgreSQL.LOGGER,
        extra: {
          trustServerCertificate: true,
        },
      });

      return dataSource.initialize();
    },
  },
  {
    provide: 'DATA_SOURCE_ORACLE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dbConfigOracle =
        configService.get<EnvInterface>('configuration')!.DB_ORACLE;

      const dataSource = new DataSource({
        type: 'oracle',
        host: dbConfigOracle.DBHOST,
        port: dbConfigOracle.DBPORT,
        username: dbConfigOracle.DBUSERNAME,
        password: dbConfigOracle.DBPASSWORD,
        database: dbConfigOracle.DBNAME,
        sid: dbConfigOracle.DBNAME,
        entities: [
          path.join(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'domain',
            '**',
            '*.oracle.entity.{ts,js}',
          ),
        ],
        synchronize: false,
        logger: 'advanced-console',
        logging: dbConfigOracle.LOGGER,
        extra: {
          trustServerCertificate: true,
        },
      });

      return dataSource.initialize();
    },
  },
];
