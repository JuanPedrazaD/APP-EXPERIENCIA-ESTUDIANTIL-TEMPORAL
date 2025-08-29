import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { StudentResponse } from 'src/domain/notification/interface/360-request/student-validation.interface';

@Injectable()
export class StudentValidationService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getStudent(
    token: string,
    documentType: string,
    document: string,
  ): Promise<StudentResponse[]> {
    try {
      const isStudent = await lastValueFrom(
        this.httpService.post(
          `https://app360qa.cunapp.pro/api/v1/student/student-programs`,
          {
            identificationType: documentType,
            identificationNumber: document,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      return isStudent.data.data;
    } catch (error) {
      const status = error?.response?.status;

      //? Si no se encuentra el usuario no es un admin
      if (status === 404) {
        return [];
      }

      const message =
        error?.response?.data?.message || `Ocurrió un error al validar el rol`;

      this.logger.error(`[SearchUserService] ${message}`, { error });

      throw new HttpException(
        message,
        status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
