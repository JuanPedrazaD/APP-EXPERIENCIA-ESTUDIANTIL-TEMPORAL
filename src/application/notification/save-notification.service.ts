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
import { NotificationIndividualDto } from 'src/domain/notification/dto/send/individual-group-request.dto';
import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';

@Injectable()
export class SaveNotificationService {
  constructor(
    @Inject('NOTIFICATION_HISTORY_REPOSITORY')
    private readonly notificationHistoryRepository: Repository<NotificationHistoryEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async saveNotification(
    notificationIndividualDto: NotificationIndividualDto,
  ) /* : Promise<number> */ {
    try {
      // Normalizas los valores del DTO
      const title = notificationIndividualDto.title?.trim();
      const message = notificationIndividualDto.message?.trim();
      const sendType = notificationIndividualDto.notificationType?.trim();

      // Se valida si existe una notificación ya creada
      const findNotification = await this.notificationHistoryRepository.findOne(
        {
          where: {
            title,
            message,
            send_type: sendType,
          },
        },
      );

      //En caso de que si, se devuelve el id de la misma
      if (findNotification) {
        return { id: findNotification.id, saved: false };
      }

      //? Si la notificación aún no ha sido creada, se crea y se devuelve el id
      const newNotification = await this.notificationHistoryRepository.save({
        title: notificationIndividualDto.title,
        message: notificationIndividualDto.message,
        appId: notificationIndividualDto.appId,
        send_type: notificationIndividualDto.notificationType,
      });

      return { id: newNotification.id, saved: true };
    } catch (e) {
      const message = `Ocurrió un error al guardar las notificaciones: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
