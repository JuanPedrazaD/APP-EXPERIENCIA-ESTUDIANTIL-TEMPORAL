import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import { NotificationGroupDto } from 'src/domain/notification/dto/send/notification-group-request.dto';
import { SendHistoryEntity } from 'src/domain/notification/entity/send-history.pstgs.entity';
import { SaveNotificationService } from '../../save-notification.service';

const DEFAULT_NOTIFICATION_ID = 1; // Valor por defecto si no se guarda la notificación

@Injectable()
export class GroupNotificationService {
  constructor(
    @Inject('SEND_HISTORY_REPOSITORY')
    private readonly sendHistoryRepository: Repository<SendHistoryEntity>,
    private readonly saveNotificationService: SaveNotificationService,
  ) {}

  async sendNotification(notificationGroupDto: NotificationGroupDto) {
    const { notificationType, saveNotification, title, message, appId } =
      notificationGroupDto;

    // Cuando se decide no guardar la notificación se utiliza el id 1
    let notificationId: number = DEFAULT_NOTIFICATION_ID;

    let saved: boolean = true;

    //Si el parametro es true se guarda la notificación o si existe se utiliza el id
    if (saveNotification == true) {
      const response = await this.saveNotificationService.saveNotification(
        title,
        message,
        notificationType,
        appId,
      );
      notificationId = response.id;
      saved = response.saved;
    }

    //? Anotaciones para guardar el titulo y el mensaje cuando el parametro save es false
    let anotations: string = '';
    if (saveNotification == false) {
      anotations = `title: ${title}, message: ${message}`;
    }
  }
}
