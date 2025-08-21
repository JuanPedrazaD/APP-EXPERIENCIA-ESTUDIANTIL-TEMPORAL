import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';
import { UserAuthEntity } from 'src/domain/auth/entities/user-auth.pstgs.entity';
import { compareHashWithPlain } from 'src/infrastructure/interface/common/utils/auth/hash-check.utils';
import { AuthResponseDto } from 'src/domain/auth/dtos/auth-response.dto';
import { AuthRequestDto } from 'src/domain/auth/dtos/auth-request.dto';

@Injectable()
export class LoginService {
  constructor(
    private jwtService: JwtService,
    @Inject('USER_AUTH_REPOSITORY')
    private readonly userAuthRepository: Repository<UserAuthEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async signIn(authRequestDto: AuthRequestDto): Promise<AuthResponseDto> {
    try {
      this.logger.log(
        'info',
        `Inicio autenticación: ${JSON.stringify(authRequestDto)}`,
      );

      const { username, password } = authRequestDto;
      const auth = await this.userAuthRepository
        .createQueryBuilder('auth')
        .where('username = :username', { username: username })
        .getOne();

      if (!auth) {
        throw new UnauthorizedException('Usuario o contraseña incorrectos');
      }

      // if (!compareHashWithPlain(auth.password, password)) {
      if (!compareHashWithPlain(password, auth.password)) {
        throw new UnauthorizedException('Usuario o contraseña incorrectos');
      }

      const payload = { sub: auth.id, username: auth.username };

      return {
        id: auth.id,
        username: auth.username,
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (e) {
      const message: string = `Error al loguear la plataforma: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
