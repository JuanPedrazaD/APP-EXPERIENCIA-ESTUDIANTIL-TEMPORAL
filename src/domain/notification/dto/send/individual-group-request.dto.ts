import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { SendNotificationBaseDto } from './send-notification-base.dto';

export class NotificationIndividualDto extends SendNotificationBaseDto {
  @ApiProperty({
    example: 'jhon.doe@cun.edu.co',
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}
