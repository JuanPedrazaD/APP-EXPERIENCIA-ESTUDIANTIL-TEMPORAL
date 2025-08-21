import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const CommonApiDocResponses = () => {
  return applyDecorators(
    ApiBadRequestResponse({
      description:
        'Petición incorrecta, generalmente cuando NO se envían los parámetros correctos',
      content: {
        'application/json': {
          example: {
            message: 'Bad Request',
            statusCode: 400,
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Falló en la autenticación',
      content: {
        'application/json': {
          example: {
            message: 'Unauthorized',
            statusCode: 401,
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description:
        'No se encontró el usuario con las credenciales proporcionadas',
      content: {
        'application/json': {
          example: {
            message: 'No se han encontrado resultados para su búsqueda',
            error: 'Not found',
            statusCode: 404,
          },
        },
      },
    }),
    ApiConflictResponse({
      description: 'El registro a crear ya se encuentra en la base de datos',
      content: {
        'application/json': {
          example: {
            message: 'El registro ya se encuentra en base de datos',
            statusCode: 409,
          },
        },
      },
    }),
    ApiResponse({
      description:
        'Específica cuando hay un fallo consultando un procedimiento almacenado, vista o tabla de la base de datos',
      status: 424,
      content: {
        'application/json': {
          example: {
            status: 424,
            message:
              "Error consultando 'especificación' Message: 'especificación error'",
          },
        },
      },
    }),
  );
};
