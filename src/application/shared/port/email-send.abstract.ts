import { ZeptoMailResponse } from 'src/domain/notification/interface/zeptomail/zeptomail-response.interface';

export abstract class EmailSendPort {
  abstract sendEmail(
    email: string,
    title: string,
    message: string,
    htmlBody: string,
  ): Promise<ZeptoMailResponse>;
}
