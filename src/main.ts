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
      'API diseñada para la gestión de encuestas de satisfacción y control de asistencia estudiantil. Permite a los docentes registrar asistencia y evaluar las condiciones del espacio de trabajo; a los estudiantes, calificar la clase recibida; y a los administrativos, consultar horarios docentes, revisar los estudiantes asignados y gestionar la calificación institucional de las clases.' +
        '\n\n' +
        '- Todos los endpoints están protegidos mediante autenticación `Bearer Token`, lo que garantiza un acceso seguro y controlado.' +
        '\n\n' +
        '- Los docentes solo podrán visualizar los horarios correspondientes al día en el que se registra la asistencia. Adicional solo se podrán calificar clases de periodos activos.' +
        '\n\n' +
        '- Los estudiantes únicamente podrán responder la encuesta de satisfacción el mismo día en que el docente registre la asistencia.' +
        '\n\n' +
        '- El personal administrativo puede consultar los horarios de un docente para un día específico; si no se especifica una fecha, se tomará como referencia la fecha actual.',
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
