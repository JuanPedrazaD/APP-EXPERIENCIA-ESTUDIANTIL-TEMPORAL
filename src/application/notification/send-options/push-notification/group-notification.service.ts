import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import { SendResponse } from 'node_modules/firebase-admin/lib/messaging/messaging-api';

import { FcmTokenEntity } from 'src/domain/fcm-token/entity/fcm-token.pstgs.entity';
import { GroupMailService } from '../email/group-mail.service';
import { NotificationGroupDto } from 'src/domain/notification/dto/send/notification-group-request.dto';
import { NotificationType } from 'src/infrastructure/interface/common/utils/helpers/enums/notification-type.utils.helpers';
import { SaveNotificationService } from '../../save-notification.service';
import { SearchStudentsDao } from 'src/domain/notification/dao/search-students.dao';
import { SendHistoryEntity } from 'src/domain/notification/entity/send-history.pstgs.entity';
import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';
import { DeviceService } from '../../batching/user-devices.service';
import { FcmSendService } from '../../batching/fcm-send.service';
import { all } from 'node_modules/axios/index.cjs';

const DEFAULT_NOTIFICATION_ID = 1; // Valor por defecto si no se guarda la notificación

@Injectable()
export class GroupNotificationService {
  constructor(
    @Inject('SEND_HISTORY_REPOSITORY')
    private readonly sendHistoryRepository: Repository<SendHistoryEntity>,
    private readonly saveNotificationService: SaveNotificationService,
    private readonly groupMailService: GroupMailService,
    private readonly searchStudentsDao: SearchStudentsDao,
    private readonly deviceService: DeviceService,
    private readonly fcmSendService: FcmSendService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async sendNotification(notificationGroupDto: NotificationGroupDto) {
    try {
      const {
        notificationType,
        saveNotification,
        title,
        message,
        appId,
        groupId,
        groupName,
      } = notificationGroupDto;

      let notificationId: number = DEFAULT_NOTIFICATION_ID;
      let saved: boolean = false;
      let anotations: string = '';

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
      } else {
        anotations = `title: ${title}, message: ${message}`;
      }

      //? Envío por email
      if (notificationType == ('email' as NotificationType)) {
        if (groupName == 'student' && groupId == -1) {
          throw new ConflictException(
            'Este grupo de estudiantes no cuenta con email institucional',
          );
        }
        return this.groupMailService
          .sendMail
          // notificationIndividualDto,
          // notificationId,
          // saved,
          ();
      }

      // Variables para resultados finales
      let totalResponses: SendResponse[] = [];
      const allDevices: FcmTokenEntity[] = [];

      if (groupName === 'student') {
        // Iterar por batch de usuarios
        for await (const usersBatch of this.searchStudentsDao.searchStudentsPaginated(
          groupId,
        )) {
          const batchEmails: string[] = usersBatch.map((u) => u.DIR_EMAIL);
          const batchDocuments: string[] = usersBatch.map(
            (u) => u.NUM_IDENTIFICACION,
          );

          // Obtener dispositivos de este batch
          const devices: FcmTokenEntity[] =
            await this.deviceService.findDevicesByEmails(
              batchEmails,
              appId,
              batchDocuments,
            );
          allDevices.push(...devices);

          const tokens = devices.map((d) => d.fcmToken);

          // Enviar notificaciones para este batch
          const responses = await this.fcmSendService.sendNotifications(
            tokens,
            title,
            message,
          );
          totalResponses.push(...responses);

          // Guardar historial por batch
          await this.sendHistoryRepository.save(
            responses.map((res, idx) => ({
              notificationId,
              tokenId: devices[idx].id,
              sendState: res.success ? 'success' : 'failure',
              anotations,
            })),
          );
        }
      }

      if (groupName == 'teacher' || groupName == 'admin') {
        //TODO realizar servicio
      }

      // Contar correctos y fallidos
      const successCount = totalResponses.filter((r) => r.success).length;
      const failureCount = totalResponses.length - successCount;

      const errors = totalResponses
        .map((res, idx) =>
          !res.success
            ? {
                tokenId: allDevices[idx].id,
                error: res.error?.message || 'Unknown error',
                code: res.error?.code || 'no-code',
              }
            : null,
        )
        .filter((e) => e !== null);

      return {
        saved,
        total: totalResponses.length,
        sended: successCount,
        failed: failureCount,
        errors,
      };
    } catch (e) {
      const message = `Ocurrió un error al enviar las notificaciones: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
