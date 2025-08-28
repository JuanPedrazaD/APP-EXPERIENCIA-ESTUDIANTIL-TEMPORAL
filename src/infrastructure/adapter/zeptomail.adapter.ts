import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { SendMailClient } from 'zeptomail';

import { EmailSendPort } from 'src/application/shared/port/email-send.abstract';
import { EnvInterface } from 'src/infrastructure/interface/common/config/config';
import { catchGenericException } from '../interface/common/utils/errors/catch-generic.exception';

@Injectable()
export class zeptoMailAdapter implements EmailSendPort {
  private readonly client: SendMailClient;
  private readonly address: string;
  private readonly name: string;
  private readonly appEnv: string;
  private readonly testMail: string;
  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    const configuration =
      this.configService.get<EnvInterface>('configuration')!;

    const { ZEPTOMAILKEY, ZEPTOMAILURL, ZEPTOMAILADDRESS, ZEPTOMAILNAME } =
      configuration.ZEPTOMAIL;
    const environment = configuration.APP_ENV;
    const testMail = configuration.TESTMAIL;

    const url = ZEPTOMAILURL;
    const token = 'Zoho-enczapikey ' + ZEPTOMAILKEY;

    this.client = new SendMailClient({ url, token });
    this.address = ZEPTOMAILADDRESS;
    this.name = ZEPTOMAILNAME;
    this.appEnv = environment || 'dev';
    this.testMail = testMail || 'pruebas@cun.edu.co';
  }

  async sendEmail(
    email: string,
    name: string,
    htmlBody: string,
  ): Promise<void> {
    try {
      //? Si el ambiente es dev o qa, se envía el correo a un email específico para pruebas
      if (this.appEnv === 'dev' || this.appEnv === 'qa') {
        email = this.testMail;
      }

      await this.client.sendMail({
        from: {
          address: this.address,
          name: this.name,
        },
        to: [
          {
            email_address: {
              address: email,
              name: name,
            },
          },
        ],
        subject: `CALIFICA TU CLASE DE HOY`,
        htmlBody: htmlBody,
      });
    } catch (e) {
      const message = `Error al enviar el correo: ${
        e?.response?.data || e?.message || JSON.stringify(e)
      }`;

      throw catchGenericException({ error: e, message, logger: this.logger });
    }
  }
}
