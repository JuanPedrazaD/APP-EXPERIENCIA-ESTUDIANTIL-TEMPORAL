import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository, In } from 'typeorm';

import { FcmTokenEntity } from 'src/domain/fcm-token/entity/fcm-token.pstgs.entity';
import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';

@Injectable()
export class DeviceService {
  constructor(
    @Inject('TOKEN_REPOSITORY')
    private readonly fcmTokenRepository: Repository<FcmTokenEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * Retorna una lista de tokens en batchings de 1000
   * @param emails: string[]
   * @param appId: number
   * @returns string[]
   */
  async findDevicesByEmails(
    emails: string[],
    appId: number,
    documents: string[],
  ): Promise<FcmTokenEntity[]> {
    try {
      const BATCH_SIZE = 1000;
      const allDevices: FcmTokenEntity[] = [];

      for (let i = 0; i < emails.length; i += BATCH_SIZE) {
        const batch = emails.slice(i, i + BATCH_SIZE);

        // Obtener los dispositivos asociados al usuario
        const devices = await this.fcmTokenRepository.find({
          where: {
            email: In(batch),
            appId,
            state: 1,
          },
        });

        allDevices.push(...devices);
      }

      return allDevices;
    } catch (e) {
      const message = `Ocurrió un error al devolver la lista de tokens: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
