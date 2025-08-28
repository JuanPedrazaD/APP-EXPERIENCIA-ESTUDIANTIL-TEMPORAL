import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import {
  BatchResponse,
  SendResponse,
} from 'firebase-admin/lib/messaging/messaging-api';

import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';
import { FcmTokenEntity } from 'src/domain/fcm-token/entity/fcm-token.pstgs.entity';
import { NotificationIndividualDto } from 'src/domain/notification/dto/send/individual-group-request.dto';
import { NotificationSendPort } from '../../shared/port/notification-send.abstract';
import { SaveNotificationService } from '../save/save-notification.service';
import { SendHistoryEntity } from 'src/domain/notification/entity/send-history.pstgs.entity';
import { NotificationType } from 'src/infrastructure/interface/common/utils/helpers/enums/notification-type.utils.helpers';
// import { EmailSendPort } from 'src/application/shared/port/email-send.abstract';
// import { EmailHTMLTemplateService } from 'src/application/shared/email-template-html.service';
import { SendEmailService } from './send-email.service';

const DEFAULT_NOTIFICATION_ID = 1; // Valor por defecto si no se guarda la notificación

@Injectable()
export class IndividualNotificationService {
  constructor(
    @Inject('TOKEN_REPOSITORY')
    private readonly fcmTokenRepository: Repository<FcmTokenEntity>,
    @Inject('SEND_HISTORY_REPOSITORY')
    private readonly sendHistoryRepository: Repository<SendHistoryEntity>,
    private readonly saveNotificationService: SaveNotificationService,
    private readonly notificationSendPort: NotificationSendPort,
    private readonly sendEmailService: SendEmailService,
    // private readonly emailSendPort: EmailSendPort,
    // private readonly emailHTMLTemplateService: EmailHTMLTemplateService,

    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async sendNotification(notificationIndividualDto: NotificationIndividualDto) {
    try {
      //? Si el modo de envío es email se redirije a otro servicio
      if (
        notificationIndividualDto.notificationType ==
        ('email' as NotificationType)
      ) {
        // const htmlBody: string = this.emailHTMLTemplateService.getEmailTemplate(
        //   notificationIndividualDto.title,
        //   notificationIndividualDto.message,
        // );
        // return this.emailSendPort.sendEmail();

        return this.sendEmailService.sendEmail(notificationIndividualDto);
      }

      // Cuando se decide no guardar la notificación se utiliza el id 1
      let notificationId: number = DEFAULT_NOTIFICATION_ID;

      //Si el parametro es true se guarda la notificación o si existe se utiliza el id
      if (notificationIndividualDto.saveNotification == true) {
        notificationId = await this.saveNotificationService.saveNotification(
          notificationIndividualDto,
        );
      }

      //? Anotaciones para guardar el titulo y el mensaje cuando no se decide guardar la notificación
      let anotations: string = '';
      if (notificationIndividualDto.saveNotification == false) {
        anotations = `title: ${notificationIndividualDto.title}, message: ${notificationIndividualDto.message}`;
      }

      //? Encontrar todos los dispositivos que tiene el usuario asignados
      const devices: FcmTokenEntity[] = await this.fcmTokenRepository.find({
        where: {
          email: notificationIndividualDto.email,
          state: 1,
        },
      });

      if (devices.length == 0) {
        throw new NotFoundException(
          `No se encontraron dispositivos el usuario ${notificationIndividualDto.email}`,
        );
      }

      // Obtener todos los tokens de los usuarios
      const tokens: string[] = devices.map((device) => device.fcmToken);

      // Envío de notificaciones
      const sendedNotifications: {
        success: boolean;
        response: BatchResponse;
      } = await this.notificationSendPort.sendNotificationToMultipleTokens(
        tokens,
        notificationIndividualDto.title,
        notificationIndividualDto.message,
      );

      // Obtener las respuestas de los envíos
      const arrayResponses: SendResponse[] =
        sendedNotifications.response.responses;

      // Guardar un registro del envío de las notificaciones
      await this.sendHistoryRepository.save(
        arrayResponses.map((res, idx) => ({
          notificationId: notificationId,
          tokenId: devices[idx].id,
          sendState: res.success ? 'success' : 'failure',
          anotations: anotations,
        })),
      );
    } catch (e) {
      const message = `Ocurrió un error al enviar la notificación: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
