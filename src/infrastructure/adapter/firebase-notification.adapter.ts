import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as admin from 'firebase-admin';

import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { NotificationSendPort } from 'src/application/shared/port/notification-send.abstract';
import { catchGenericException } from '../interface/common/utils/errors/catch-generic.exception';
import { EnvInterface } from '../interface/common/config/config';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';

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

  async sendNotificationToMultipleTokens(
    tokens: string[],
    title: string,
    body: string,
  ): Promise<{
    success: boolean;
    response: BatchResponse;
  }> {
    try {
      const message: admin.messaging.MulticastMessage = {
        tokens,
        notification: {
          title,
          body,
        },
      };

      const response: BatchResponse = await this.firebaseApp
        .messaging()
        .sendEachForMulticast(message);

      this.logger.info(
        `Notificación enviada: ${response.successCount} exitosas, ${response.failureCount} fallidas`,
      );

      return {
        success: response.failureCount === 0,
        response,
      };
    } catch (e) {
      const message = `Error al enviar la notificación: ${
        e?.response?.data || e?.message || JSON.stringify(e)
      }`;

      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
