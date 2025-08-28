import { HttpException, Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class Login360Service {
  constructor(
    private readonly httpService: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async loginUser(
    url: string,
    username: string,
    password: string,
  ): Promise<string> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${url}/auth/login`,
          {
            username,
            password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      // Obtener el token
      const token = response.data?.access_token;

      if (!token) {
        throw new Error('No se recibió un token en la respuesta del login');
      }

      return token;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        `Error al hacer login para la url ${url}: ${error.message}`;
      this.logger.error(`[AuthService] ${message}`, { error });

      throw new HttpException(message, error?.response?.status || 500);
    }
  }
}
