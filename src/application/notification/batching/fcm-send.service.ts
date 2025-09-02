import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import * as pLimit from 'p-limit';

import { NotificationSendPort } from 'src/application/shared/port/notification-send.abstract';
import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';
import { SendResponse } from 'node_modules/firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class FcmSendService {
  private readonly CHUNK_SIZE = 500;
  private readonly CONCURRENCY = 5; // lotes paralelos

  constructor(
    private readonly notificationSendPort: NotificationSendPort,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * Envía notificaciones por lotes y acumula todas las respuestas individuales.
   * @param tokens Array de FCM tokens
   * @param title Título de la notificación
   * @param message Mensaje de la notificación
   * @returns Array de respuestas de envío (una por token)
   */
  async sendNotifications(
    tokens: string[],
    title: string,
    message: string,
  ): Promise<SendResponse[]> {
    try {
      const limit = pLimit(this.CONCURRENCY);

      // Dividir en chunks de 500
      const chunks: string[][] = [];
      for (let i = 0; i < tokens.length; i += this.CHUNK_SIZE) {
        chunks.push(tokens.slice(i, i + this.CHUNK_SIZE));
      }

      const results: SendResponse[][] = await Promise.all(
        chunks.map((chunk, idx) =>
          limit(async () => {
            this.logger.info(
              `[FcmSendService] Lote ${idx + 1}/${chunks.length} (${chunk.length} tokens)`,
            );

            const res =
              await this.notificationSendPort.sendNotificationToMultipleTokens(
                chunk,
                title,
                message,
              );

            return res.response.responses;
          }),
        ),
      );

      return results.flat();
    } catch (e) {
      const message = `Error al enviar las notificaciones: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
