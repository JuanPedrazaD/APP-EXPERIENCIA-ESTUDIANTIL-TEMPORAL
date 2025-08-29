import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';
import { FcmTokenEntity } from 'src/domain/fcm-token/entity/fcm-token.pstgs.entity';
import { SendHistoryEntity } from 'src/domain/notification/entity/send-history.pstgs.entity';
import { NotificationByUserDao } from 'src/domain/notification/dao/notification-by-user.dao';

@Injectable()
export class NotificationsByuserService {
  constructor(
    @Inject('TOKEN_REPOSITORY')
    private readonly fcmTokenRepository: Repository<FcmTokenEntity>,
    private readonly notificationByUserDao: NotificationByUserDao,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getNotifications(email: string) {
    try {
      const tokens: FcmTokenEntity[] = await this.fcmTokenRepository.find({
        where: {
          email,
          state: 1,
        },
      });

      if (tokens.length == 0) {
        throw new NotFoundException(
          'No se encontraron tokens asociados al usuario',
        );
      }

      const notifications = await this.notificationByUserDao.getNotifications(
        tokens,
        email,
      );

      return notifications;
    } catch (e) {
      const message = `Ocurrió un error al obtener las notificaciones: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
