import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';
import { hashData } from 'src/infrastructure/interface/common/utils/auth/hash-check.utils';
import { UserAuthEntity } from 'src/domain/auth/entity/user-auth.pstgs.entity';
import { AuthRequestDto } from 'src/domain/auth/dto/auth-request.dto';
import { AuthResponseDto } from 'src/domain/auth/dto/auth-response.dto';

@Injectable()
export class RegisterService {
  constructor(
    private jwtService: JwtService,
    @Inject('USER_AUTH_REPOSITORY')
    private readonly userAuthRepository: Repository<UserAuthEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async register(authRequestDto: AuthRequestDto): Promise<AuthResponseDto> {
    try {
      this.logger.log(
        'info',
        `Inicio registro de plataforma: ${JSON.stringify(authRequestDto)}`,
      );

      // Encriptar contraseña con salt y 10 rondas por defecto
      const hashedPassword: string = hashData(authRequestDto.password);
      const auth: UserAuthEntity = this.userAuthRepository.create({
        ...authRequestDto,
        password: hashedPassword,
      });

      //Guardar el usuario creado
      await this.userAuthRepository.save(auth);

      //Crear jwt con la información del usuario
      const payload = {
        sub: auth.id,
        username: auth.username,
      };
      const access_token: string = await this.jwtService.signAsync(payload);

      return {
        id: auth.id,
        username: auth.username,
        access_token: access_token,
      };
    } catch (e) {
      const message: string = `Error al registrar la plataforma ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
