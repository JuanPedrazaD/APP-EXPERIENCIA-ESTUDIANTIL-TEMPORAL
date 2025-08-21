import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      // options
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(), // Aplica colores a los niveles de log
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss', // Formato de timestamp
            }),
            winston.format.printf(({ timestamp, level, message }) => {
              return `[${timestamp}] ${level}: ${message}`; // Formato del mensaje
            }),
          ),
        }),
      ],
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
