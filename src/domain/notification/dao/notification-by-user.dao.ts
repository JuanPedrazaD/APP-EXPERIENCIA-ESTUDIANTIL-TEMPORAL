import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import { SendHistoryEntity } from '../entity/send-history.pstgs.entity';
import { NotificationHistoryEntity } from '../entity/notification-history.pstgs.entity';
import { FcmTokenEntity } from 'src/domain/fcm-token/entity/fcm-token.pstgs.entity';
import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';

@Injectable()
export class NotificationByUserDao {
  constructor(
    @Inject('SEND_HISTORY_REPOSITORY')
    private readonly sendHistoryRepository: Repository<SendHistoryEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getNotifications(tokens: FcmTokenEntity[], email: string) {
    try {
      console.log(tokens);

      const notifications = await this.sendHistoryRepository
        .createQueryBuilder('sendHistory')
        .innerJoin(
          NotificationHistoryEntity,
          'notificationHistory',
          'sendHistory.notificacion_id = notificationHistory.id',
        )
        .where('sendHistory.tokenId = :token', {
          // token: tokens[0].id,
          token: 4,
        })
        .getMany();

      return notifications;
    } catch (e) {
      const message = `Ocurrió un error al devolver las notificaciones: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
