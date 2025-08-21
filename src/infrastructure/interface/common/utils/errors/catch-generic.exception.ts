/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  InternalServerErrorException,
  RequestTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';

import { GenericError } from './generic-error.interface';
import { failedDependencyException } from './failed-dependency.exception';

export const catchGenericException = (genericError: GenericError) => {
  const { error, message, logger, additionalLogger } = genericError;

  if (error?.status?.code < 500 || error?.status < 500) throw error;

  logger.error(message);
  logger.error(error.message);

  if (error?.errorNum === 1) {
    const match = error?.message?.match(/\(([^)]+)\)/);
    const extractedMessage = match ? match[1] : error.message;
    throw new BadRequestException(`Registro ya existente. ${extractedMessage}`);
  }

  if (
    error?.code === 'ETIMEDOUT' ||
    error?.code === 'ECONNABORTED' ||
    error?.message?.toLowerCase().includes('timeout')
  ) {
    console.log(error?.message);
    throw new RequestTimeoutException(
      'No se pudo establecer la conexión. Por favor intente nuevamente o contacte a la mesa de ayuda: ' +
        error?.message,
    );
  }

  if (
    error?.code === 'ECONNREFUSED' ||
    error?.code === 'EHOSTUNREACH' ||
    error?.message?.toLowerCase().includes('connection refused') ||
    error?.message?.toLowerCase().includes('host unreachable')
  ) {
    throw new ServiceUnavailableException(
      'El servicio no está disponible en este momento. Por favor intente nuevamente o contacte a la mesa de ayuda: ' +
        error?.message,
    );
  }

  if (additionalLogger) additionalLogger();

  if (error?.code === 'EREQUEST' || error?.message?.includes('ORA'))
    return failedDependencyException(message);

  console.log(error);

  throw new InternalServerErrorException(message);
};
