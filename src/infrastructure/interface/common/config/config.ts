import { registerAs } from '@nestjs/config';
import { LogLevel } from 'typeorm';

export type ValidAppEnv = 'dev' | 'qa' | 'staging' | 'production';

export interface EnvInterface {
  PORT: number;
  TIMEOUT: number;
  API_PREFIX: string;
  APP_ENV: ValidAppEnv;
  WEB360: string;
  CDN: string;
  TESTMAIL: string;
  SWAGGER: {
    SWAGGER_PATH: string;
    SWAGGER_USER: string;
    SWAGGER_PASS: string;
  };
  DB_POSTGRESQL: {
    DBHOST: string;
    DBPORT: number;
    DBNAME: string;
    DBUSERNAME: string;
    DBPASSWORD: string;
    LOGGER: LogLevel[];
  };
}

export default registerAs('configuration', (): EnvInterface => {
  //? Validación para etorno del proyecto
  const rawAppEnv = process.env.APP_ENV?.toLowerCase() || 'local';
  const validAppEnvs: ValidAppEnv[] = ['dev', 'qa', 'staging', 'production'];

  if (!validAppEnvs.includes(rawAppEnv as ValidAppEnv)) {
    throw new Error(
      `APP_ENV inválido: "${rawAppEnv}". Debe ser uno de: ${validAppEnvs.join(', ')}`,
    );
  }
  return {
    PORT: parseInt(process.env.PORT || '8081'),
    TIMEOUT: parseInt(process.env.TIMEOUT || '60'),
    API_PREFIX: process.env.API_PREFIX || 'api/v2',
    APP_ENV: process.env.APP_ENV as ValidAppEnv,
    WEB360: process.env.WEB360 || 'http://localhost:4200/#/',
    CDN: process.env.CDN || 'http://localhost',
    TESTMAIL: process.env.TESTMAIL || 'pruebas@cun.edu.co',
    SWAGGER: {
      SWAGGER_PATH: process.env.SWAGGER_PATH || 'swagger',
      SWAGGER_USER: process.env.SWAGGER_USER || 'root',
      SWAGGER_PASS: process.env.SWAGGER_PASS || '',
    },
    DB_POSTGRESQL: {
      DBHOST: process.env.DB_POSTGRESQL_HOST || 'localhost',
      DBPORT: parseInt(process.env.DB_POSTGRESQL_PORT || '1521', 10),
      DBNAME: process.env.DB_POSTGRESQL_NAME || 'XE',
      DBUSERNAME: process.env.DB_POSTGRESQL_USER || 'postgresql_user',
      DBPASSWORD: process.env.DB_POSTGRESQL_PASS || 'postgresql_pass',
      LOGGER: JSON.parse(process.env.POSTGRESQL_LOGGER || '[]'),
    },
  };
});
