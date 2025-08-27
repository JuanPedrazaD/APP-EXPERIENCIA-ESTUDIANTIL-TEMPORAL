import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import { NotificationIndividualDto } from 'src/domain/notification/dto/send/individual-group-request.dto';
import { FcmTokenEntity } from 'src/domain/fcm-token/entity/fcm-token.pstgs.entity';
import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';

@Injectable()
export class IndividualNotificationService {
  constructor(
    @Inject('TOKEN_REPOSITORY')
    private readonly fcmTokenRepository: Repository<FcmTokenEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async sendNotification(notificationIndividualDto: NotificationIndividualDto) {
    try {
      const devices: FcmTokenEntity[] = await this.fcmTokenRepository.find({
        where: {
          email: notificationIndividualDto.email,
        },
      });

      if (devices.length > 0) {
        throw new NotFoundException(
          `No se encontraron dispositivos el usuario ${notificationIndividualDto.email}`,
        );
      }
    } catch (e) {
      const message = `Ocurrió un error al enviar la notificación: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
