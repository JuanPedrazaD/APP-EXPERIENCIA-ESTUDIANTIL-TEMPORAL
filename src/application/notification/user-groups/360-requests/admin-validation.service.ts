import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { EmployeeResponse } from 'src/domain/notification/interface/360-request/admin-validation.interface';

@Injectable()
export class AdminValidationService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getAdmin(
    token: string,
    email: string,
  ): Promise<EmployeeResponse | null> {
    try {
      const isAdmin = await lastValueFrom(
        this.httpService.get<EmployeeResponse>(
          `https://app360-adminqa.cunapp.pro/api/v1/employee/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      return isAdmin.data;
    } catch (error) {
      const status = error?.response?.status;

      //? Si no se encuentra el usuario no es un admin
      if (status === 404) {
        return null;
      }

      const message =
        error?.response?.data?.message ||
        `Ocurrió un error al obtener el usuario`;

      this.logger.error(`[SearchUserService] ${message}`, { error });

      throw new HttpException(
        message,
        status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
