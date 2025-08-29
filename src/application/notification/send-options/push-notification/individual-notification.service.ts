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
import { NotificationSendPort } from '../../../shared/port/notification-send.abstract';
import { NotificationType } from 'src/infrastructure/interface/common/utils/helpers/enums/notification-type.utils.helpers';
import { SaveNotificationService } from '../../save-notification.service';
import { SendEmailService } from '../email/individual-email.service';
import { SendHistoryEntity } from 'src/domain/notification/entity/send-history.pstgs.entity';

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
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async sendNotification(notificationIndividualDto: NotificationIndividualDto) {
    const { notificationType, saveNotification, title, email, message } =
      notificationIndividualDto;

    try {
      //? Si el modo de envío es email se usa zeptomail
      if (notificationType == ('email' as NotificationType)) {
        return this.sendEmailService.sendEmail(notificationIndividualDto);
      }

      // Cuando se decide no guardar la notificación se utiliza el id 1
      let notificationId: number = DEFAULT_NOTIFICATION_ID;

      let saved: boolean = true;

      //Si el parametro es true se guarda la notificación o si existe se utiliza el id
      if (saveNotification == true) {
        const response = await this.saveNotificationService.saveNotification(
          notificationIndividualDto,
        );
        notificationId = response.id;
        saved = response.saved;
      }

      //? Anotaciones para guardar el titulo y el mensaje cuando no se decide guardar la notificación
      let anotations: string = '';
      if (saveNotification == false) {
        anotations = `title: ${title}, message: ${message}`;
      }

      //? Encontrar todos los dispositivos que tiene el usuario asignados
      const devices: FcmTokenEntity[] = await this.fcmTokenRepository.find({
        where: {
          email,
          state: 1,
        },
      });

      if (devices.length == 0) {
        throw new NotFoundException(
          `No se encontraron dispositivos el usuario ${email}`,
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
        title,
        message,
      );

      // Obtener las respuestas de los envíos
      const arrayResponses: SendResponse[] =
        sendedNotifications.response.responses;

      // Guardar un registro del envío de las notificaciones
      await this.sendHistoryRepository.save(
        arrayResponses.map((res, idx) => ({
          notificationId,
          tokenId: devices[idx].id,
          sendState: res.success ? 'success' : 'failure',
          anotations,
        })),
      );

      // Contar cuántos fueron correctos y cuántos fallaron
      const successCount = arrayResponses.filter((r) => r.success).length;
      const failureCount = arrayResponses.length - successCount;

      // Si hubo respuestas
      if (arrayResponses.length > 0) {
        // Extraer detalles de los fallos
        const errors = arrayResponses
          .map((res, idx) => {
            if (!res.success) {
              return {
                tokenId: devices[idx].id,
                error: res.error?.message || 'Unknown error',
                code: res.error?.code || 'no-code',
              };
            }
            return null;
          })
          .filter((f) => f !== null);

        return {
          saved,
          total: arrayResponses.length,
          sended: successCount,
          failed: failureCount,
          errors,
        };
      }
      // Retornar el resultado vacío si no hubo respuestas
      return {
        saved,
        total: arrayResponses.length,
        failed: successCount,
        errors: failureCount,
      };
    } catch (e) {
      const message = `Ocurrió un error al enviar la notificación: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
