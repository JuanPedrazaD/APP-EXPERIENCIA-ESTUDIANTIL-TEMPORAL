import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';
import { NotificationHistoryEntity } from 'src/domain/notification/entity/notification-history.pstgs.entity';
import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';

@Injectable()
export class SaveNotificationService {
  constructor(
    @Inject('NOTIFICATION_HISTORY_REPOSITORY')
    private readonly notificationHistoryRepository: Repository<NotificationHistoryEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async saveNotification(
    title: string,
    message: string,
    sendType: string,
    appId: number,
  ): Promise<{
    id: number;
    saved: boolean;
  }> {
    try {
      // Se valida si existe una notificación ya creada
      const findNotification: NotificationHistoryEntity | null =
        await this.notificationHistoryRepository.findOne({
          where: {
            title,
            message,
            sendType,
          },
        });

      //En caso de que si, se devuelve el id de la misma
      if (findNotification) {
        return { id: findNotification.id, saved: false };
      }

      //? Si la notificación aún no ha sido creada, se crea y se devuelve el id
      const newNotification: {
        title: string;
        message: string;
        appId: number;
        send_type: string;
      } & NotificationHistoryEntity =
        await this.notificationHistoryRepository.save({
          title: title,
          message: message,
          appId: appId,
          send_type: sendType,
        });

      return { id: newNotification.id, saved: true };
    } catch (e) {
      const message = `Ocurrió un error al guardar las notificaciones: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
