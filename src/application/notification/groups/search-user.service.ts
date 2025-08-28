import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import { Login360Service } from './360-requests/360-apis-login.service';
import { AdminValidationService } from './360-requests/admin-validation.service';
import { EmployeeResponse } from 'src/domain/notification/interface/360-request/admin-validation.interface';
import { UserInfoEntity } from 'src/domain/fcm-token/entity/user-info.oracle.entity';
import { StudentValidationService } from './360-requests/student-validation.service';
import { ConfigService } from '@nestjs/config';
import { EnvInterface } from 'src/infrastructure/interface/common/config/config';
import { StudentResponse } from 'src/domain/notification/interface/360-request/student-validation.interface';
import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';

@Injectable()
export class SearchUserService {
  constructor(
    @Inject('USER_INFO_REPOSITORY')
    private readonly userInfoRepository: Repository<UserInfoEntity>,
    private readonly configService: ConfigService,
    private readonly login360Service: Login360Service,
    private readonly adminValidationService: AdminValidationService,
    private readonly studentValidationService: StudentValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getUser(email: string) {
    try {
      const { USERNAME, PASSWORD, URL } =
        this.configService.get<EnvInterface>('configuration')?.API_360!;
      const { ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_URL } =
        this.configService.get<EnvInterface>('configuration')?.API_360_ADMIN!;

      // Buscar información del usuario
      const user: UserInfoEntity | null = await this.userInfoRepository.findOne(
        { where: { email } },
      );
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con correo ${email}`,
        );
      }

      let roles: string[] = [];

      // Validar si es estudiante
      const studentToken: string = await this.login360Service.loginUser(
        URL,
        USERNAME,
        PASSWORD,
      );
      // Petición para saber si es estudiante
      const studentData: StudentResponse[] =
        await this.studentValidationService.getStudent(
          studentToken,
          user.idType,
          user.document,
        );

      if (
        // Si tiene programas en activo o egresado se le brinda rol estudiante
        studentData.some((s) =>
          ['activo', 'egresado'].includes(s.status.toLowerCase()),
        )
      ) {
        roles.push('student');
      }

      // 3. Validar si es administrativo/docente
      const adminToken: string = await this.login360Service.loginUser(
        ADMIN_URL,
        ADMIN_USERNAME,
        ADMIN_PASSWORD,
      );

      // Petición a 360 admin para saber el rol
      const employee: EmployeeResponse | null =
        await this.adminValidationService.getAdmin(adminToken, email);
      if (employee) {
        const position: string = employee.userPosition.toLowerCase();
        roles.push(position.includes('docente') ? 'docente' : 'administrativo');
      }

      if (roles.length === 0) {
        throw new NotFoundException(
          'No se encontró un rol válido para el usuario',
        );
      }

      return {
        name: user.fullName,
        document: user.document,
        roles,
      };
    } catch (e) {
      const message = `Ocurrió un error al obtener el rol del usuario: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
