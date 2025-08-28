import { Injectable } from '@nestjs/common';
import { NotificationIndividualDto } from 'src/domain/notification/dto/send/individual-group-request.dto';

@Injectable()
export class SendEmailService {
  constructor() {}

  async sendEmail(notificationIndividualDto: NotificationIndividualDto) {}
}
