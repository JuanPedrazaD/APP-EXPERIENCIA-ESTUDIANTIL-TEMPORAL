import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import configuration, {
  EnvInterface,
} from './infrastructure/interface/common/config/config';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as basicAuth from 'express-basic-auth';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: EnvInterface = app.get<EnvInterface>(configuration.KEY);
  const prefix: string = app.get(configuration.KEY).API_PREFIX;
  const swaggerPath: string =
    '/' + prefix + app.get(configuration.KEY).SWAGGER.SWAGGER_PATH;
  const swaggerUser: string = app.get(configuration.KEY).SWAGGER.SWAGGER_USER;
  const swaggerPass: string = app.get(configuration.KEY).SWAGGER.SWAGGER_PASS;
  const logger = app.get(WINSTON_MODULE_PROVIDER) as Logger;

  app.setGlobalPrefix(prefix);
  app.enableCors();
  app.enableVersioning();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Middleware para proteger Swagger con usuario y contraseña
  app.use(
    [swaggerPath, swaggerPath + '-json'], // Protege las rutas de Swagger
    basicAuth({
      users: { [swaggerUser]: swaggerPass }, // Usuario y contraseña
      challenge: true, // Muestra ventana emergente en el navegador
    }),
  );

  //Swagger implementation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('APP Encuestas')
    .setDescription(
      'API diseñada para la gestión de envío de notificaciones, tanto de forma individual como de forma masiva.' +
        '\n\n' +
        '- Todos los endpoints están protegidos mediante autenticación `Bearer Token`, lo que garantiza un acceso seguro y controlado.' +
        '\n\n' +
        '- Las notificaciones se podrán enviar de manera manual, pero tambien se contarán con notificaciones automaticas.' +
        '\n\n' +
        '- Ya lleva configurado el almacenamiento de tokens.' +
        '\n\n' +
        '- Las notificaciones se podrán enviar de manera individual o masivas.',
    )
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      in: 'header',
    })
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(config.PORT);
}
bootstrap();
