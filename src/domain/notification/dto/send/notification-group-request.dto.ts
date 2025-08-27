import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

import { SendNotificationBaseDto } from './send-notification-base.dto';

export class NotificationGroupDto extends SendNotificationBaseDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  groupId: number;
}
