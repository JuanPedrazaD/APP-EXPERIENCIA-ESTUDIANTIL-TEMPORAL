import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as admin from 'firebase-admin';

import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { NotificationSendPort } from 'src/application/shared/port/notification-send.abstract';
import { catchGenericException } from '../interface/common/utils/errors/catch-generic.exception';
import { EnvInterface } from '../interface/common/config/config';

@Injectable()
export class FirebaseNotificationAdapter implements NotificationSendPort {
  private firebaseApp: admin.app.App;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    const { PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY } =
      this.configService.get<EnvInterface>('configuration')?.FIREBASE!;

    // Inicializar Firebase Admin solo una vez
    if (!admin.apps.length) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: PROJECT_ID,
          clientEmail: CLIENT_EMAIL,
          privateKey: PRIVATE_KEY,
        }),
      });
    } else {
      this.firebaseApp = admin.app();
    }
  }

  async sendNotification(token: string, title: string, body: string) {
    try {
      const message: admin.messaging.Message = {
        token,
        notification: {
          title,
          body,
        },
      };

      const response = await this.firebaseApp.messaging().send(message);

      this.logger.info(`Notificación enviada correctamente: ${response}`);
      return { success: true, response };
    } catch (e) {
      const message = `Error al enviar la notificación: ${
        e?.response?.data || e?.message || JSON.stringify(e)
      }`;

      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
