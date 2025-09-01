import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository, In } from 'typeorm';

import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';
import { FcmTokenEntity } from 'src/domain/fcm-token/entity/fcm-token.pstgs.entity';
import { SendHistoryEntity } from 'src/domain/notification/entity/send-history.pstgs.entity';
import { NotificationByUserRequestDto } from 'src/domain/notification/dto/notification-by-user-request.dto';

@Injectable()
export class NotificationsByuserService {
  constructor(
    @Inject('TOKEN_REPOSITORY')
    private readonly fcmTokenRepository: Repository<FcmTokenEntity>,
    @Inject('SEND_HISTORY_REPOSITORY')
    private readonly sendHistoryRepository: Repository<SendHistoryEntity>,
    // private readonly notificationByUserDao: NotificationByUserDao,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getNotifications(
    notificationByUserRequestDto: NotificationByUserRequestDto,
  ) {
    try {
      const { email, appId } = notificationByUserRequestDto;

      // Obtener los tokens asociados al usuario segpun la aplicación
      const tokens: FcmTokenEntity[] = await this.fcmTokenRepository.find({
        where: {
          email,
          appId,
          state: 1,
        },
      });

      if (tokens.length == 0) {
        throw new NotFoundException(
          'No se encontraron tokens asociados al usuario',
        );
      }

      // Obtener los ids de los tokens
      const tokenIds: number[] = tokens.map((token) => token.id);

      //? Obtener las notificaciones enviadas al usuario:
      /*
       * Nota: un usuario maximo puede tener 3 tokens por aplicación
       * 1. Web
       * 2. Android
       * 3. Ios
       * Los diferentes ambientes se toman como aplicaciónes diferentes
       */
      const notifications: SendHistoryEntity[] =
        await this.sendHistoryRepository.find({
          where: {
            tokenId: In(tokenIds),
          },
        });

      if (notifications.length == 0) {
        throw new NotFoundException(
          'No se encontraron notificaciones para el usuario con la aplicación especificada',
        );
      }

      return notifications;
    } catch (e) {
      const message = `Ocurrió un error al obtener las notificaciones: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
