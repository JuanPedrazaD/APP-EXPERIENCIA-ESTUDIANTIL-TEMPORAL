import { Inject, Injectable } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { catchGenericException } from 'src/infrastructure/interface/common/utils/errors/catch-generic.exception';
import { EmailHTMLTemplateService } from 'src/application/shared/email/email-template-html.service';
import { EmailSendPort } from 'src/application/shared/port/email-send.abstract';
import { NotificationIndividualDto } from 'src/domain/notification/dto/send/individual-group-request.dto';

@Injectable()
export class SendEmailService {
  constructor(
    private readonly emailHTMLTemplateService: EmailHTMLTemplateService,
    private readonly emailSendPort: EmailSendPort,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async sendEmail(notificationIndividualDto: NotificationIndividualDto) {
    try {
      const { title, message, email } = notificationIndividualDto;

      const htmlBody: string = this.emailHTMLTemplateService.getEmailTemplate(
        title,
        message,
      );

      return this.emailSendPort.sendEmail(email, title, message, htmlBody);
    } catch (e) {
      const message = `Ocurrió un error al enviar el email: ${e?.message}`;
      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
