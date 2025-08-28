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

import { Login360Service } from './360/360-login.service';
import { AdminValidationService } from './360/admin-validation.service';
import { EmployeeResponse } from 'src/domain/notification/interface/360-request/admin-validation.interface';
import { UserInfoEntity } from 'src/domain/fcm-token/entity/user-info.oracle.entity';
import { StudentValidationService } from './360/student-validation.service';
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

  // async getUser(email: string) {
  //   try {
  //     const { USERNAME, PASSWORD, URL } =
  //       this.configService.get<EnvInterface>('configuration')?.API_360!;
  //     const { ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_URL } =
  //       this.configService.get<EnvInterface>('configuration')?.API_360_ADMIN!;

  //     //? Obtener el token para conectarse a la api de administrativos 360
  //     const token360: string = await this.login360Service.loginUser(
  //       ADMIN_URL,
  //       ADMIN_USERNAME,
  //       ADMIN_PASSWORD,
  //     );

  //     // Obtener los datos del usuario
  //     const user: UserInfoEntity | null = await this.userInfoRepository.findOne(
  //       {
  //         where: {
  //           email: email,
  //         },
  //       },
  //     );

  //     if (!user) {
  //       throw new NotFoundException(
  //         `No se encontró el usuario con correo ${email}`,
  //       );
  //     }

  //     // Verificar en endpoint de 360 si es admin o docente
  //     const isAdminOrTeacher: EmployeeResponse | null =
  //       await this.adminValidationService.getAdmin(token360, email);

  //     let userRole: string;

  //     if (isAdminOrTeacher) {
  //       if (isAdminOrTeacher.userPosition.toLowerCase().includes('docente')) {
  //         userRole = 'docente';
  //       }

  //       if (
  //         isAdminOrTeacher.userPosition.toLowerCase().includes('docente') ==
  //         false
  //       ) {
  //         userRole = 'administrativo';
  //       }
  //     }

  //     //? Obtener el token para conectarse a la api de 360
  //     const tokenAdmin360: string = await this.login360Service.loginUser(
  //       URL,
  //       USERNAME,
  //       PASSWORD,
  //     );

  //     //? Verificar si el usuario es un estudiante
  //     const isStudent: StudentResponse[] | null =
  //       await this.studentValidationService.getStudent(
  //         tokenAdmin360,
  //         user.idType,
  //         user.document,
  //       );

  //     if (isStudent && isStudent.length > 0) {
  //       const hasValidStatus = isStudent.some(
  //         (student) =>
  //           student.status.toLowerCase() === 'activo' ||
  //           student.status.toLowerCase() === 'egresado',
  //       );

  //       if (hasValidStatus) {
  //         userRole = 'student';
  //       } else {
  //         throw new NotFoundException(
  //           'No se encontró un rol válido para el usuario',
  //         );
  //       }
  //     } else {
  //       throw new NotFoundException('No se encontró un rol para el usuario');
  //     }

  //     return {
  //       name: user.fullName,
  //       document: user.document,
  //       role: userRole,
  //     };
  //   } catch (e) {
  //     const message = `Ocurrió un error al obtener los datos del usuario: ${e?.message}`;
  //     throw catchGenericException({ error: e, message, logger: this.logger });
  //   }
  // }
  async getUser(email: string) {
    try {
      const { USERNAME, PASSWORD, URL } =
        this.configService.get<EnvInterface>('configuration')?.API_360!;
      const { ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_URL } =
        this.configService.get<EnvInterface>('configuration')?.API_360_ADMIN!;

      // 1. Buscar usuario en DB
      const user = await this.userInfoRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con correo ${email}`,
        );
      }

      let roles: string[] = [];

      // 2. Validar si es estudiante
      const studentToken = await this.login360Service.loginUser(
        URL,
        USERNAME,
        PASSWORD,
      );
      const studentData: StudentResponse[] =
        await this.studentValidationService.getStudent(
          studentToken,
          user.idType,
          user.document,
        );

      if (
        studentData.some((s) =>
          ['activo', 'egresado'].includes(s.status.toLowerCase()),
        )
      ) {
        roles.push('student');
      }

      // 3. Validar si es admin/docente (solo si no era estudiante o si quieres múltiples roles)
      const adminToken = await this.login360Service.loginUser(
        ADMIN_URL,
        ADMIN_USERNAME,
        ADMIN_PASSWORD,
      );

      const employee = await this.adminValidationService.getAdmin(
        adminToken,
        email,
      );
      if (employee) {
        const position = employee.userPosition.toLowerCase();
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
