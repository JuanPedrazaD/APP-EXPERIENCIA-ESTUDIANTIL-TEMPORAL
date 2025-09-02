import { Inject, Injectable } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';
import { EmailHTMLTemplateService } from 'src/application/shared/email/email-template-html.service';
import { EmailSendPort } from 'src/application/shared/port/email-send.abstract';
import { NotificationIndividualDto } from 'src/domain/notification/dto/send/notification-individual-request.dto';
import { MailSendHistoryEntity } from 'src/domain/notification/entity/email/mail-send-history.pstgs.entity';
import { ZeptoMailResponse } from 'src/domain/notification/interface/zeptomail/zeptomail-response.interface';

@Injectable()
export class IndividualMailService {
  constructor(
    @Inject('MAIL_SEND_HISTORY_REPOSITORY')
    private readonly mailSendHistoryRepository: Repository<MailSendHistoryEntity>,
    private readonly emailHTMLTemplateService: EmailHTMLTemplateService,
    private readonly emailSendPort: EmailSendPort,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async sendEmail(
    notificationIndividualDto: NotificationIndividualDto,
    notificationId: number,
    saved: boolean,
  ) {
    try {
      const { title, message, email, appId } = notificationIndividualDto;

      // Obtener el html del correo
      const htmlBody: string = this.emailHTMLTemplateService.getEmailTemplate(
        title,
        message,
      );

      //Enviar el email y obtener una respuesta
      const response: ZeptoMailResponse = await this.emailSendPort.sendEmail(
        email,
        title,
        message,
        htmlBody,
      );

      if (response.message != 'OK') {
        throw new Error(`Error al enviar el email: ${response.message}`);
      }

      // Guardar el envío del correo en base de datos
      await this.mailSendHistoryRepository.save({
        notificationId,
        appId,
        sendState: response.message,
      });

      // Devolver la respuesta y si la notificación fue guardada
      return {
        saved,
        response: response.message,
      };

      // await emailSendPort.sendEmail(email, title, message, htmlBody);
    } catch (e) {
      const message = `Ocurrió un error al enviar el email: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
