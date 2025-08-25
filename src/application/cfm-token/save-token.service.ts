import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import { SaveTokenRequestDto } from 'src/domain/fcm-token/dto/save-token-request.dto';
import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';
import { FcmTokenEntity } from 'src/domain/fcm-token/entity/fcm-token.pstgs.entity';
import { UserInfoEntity } from 'src/domain/fcm-token/entity/user-info.oracle.entity';

@Injectable()
export class HandleTokenService {
  constructor(
    @Inject('TOKEN_REPOSITORY')
    private readonly fcmTokenRepository: Repository<FcmTokenEntity>,
    @Inject('USER_INFO_REPOSITORY')
    private readonly userInfoRepository: Repository<UserInfoEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async handleToken(saveTokenRequestDto: SaveTokenRequestDto) {
    try {
      const {
        token,
        userEmail,
        appId: applicationId,
        deviceId,
      } = saveTokenRequestDto;

      //? Se busca un token ya registrado por app, correo y tipo de dispositivo
      const tokenAlreadyRegistered: FcmTokenEntity | null =
        await this.fcmTokenRepository.findOne({
          where: [
            {
              appId: applicationId,
              email: userEmail,
              deviceTypeId: deviceId,
            },
          ],
        });

      if (tokenAlreadyRegistered) {
        // Si el token enviado es el mismo que el que esta guardado se devuelve una excepción
        if (tokenAlreadyRegistered.fcmToken == token) {
          throw new ConflictException('Este token ya esta en uso');
        }

        //? Actualización de token
        await this.fcmTokenRepository.update(
          {
            appId: applicationId,
            email: userEmail,
            deviceTypeId: deviceId,
          },
          {
            fcmToken: token,
          },
        );
        return;
      }

      //? Encontrar la cédula del usuario
      const user: UserInfoEntity | null = await this.userInfoRepository.findOne(
        {
          where: {
            email: userEmail,
          },
        },
      );

      if (!user) {
        throw new NotFoundException(
          `No se encontro un usuario con el correo ${userEmail}`,
        );
      }

      // Guardado de un nuevo token
      await this.fcmTokenRepository.insert({
        fcmToken: token,
        appId: applicationId,
        deviceTypeId: deviceId,
        document: user.document,
        email: userEmail,
        state: 1,
      });
    } catch (e) {
      const message = `Ocurrió un error al guardar el token: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
