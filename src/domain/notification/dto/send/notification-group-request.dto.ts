import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty } from 'class-validator';

import { SendNotificationBaseDto } from './send-notification-base.dto';

export class NotificationGroupDto extends SendNotificationBaseDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  groupId: number;

  @ApiProperty({
    example: 1,
  })
  @IsIn(['teacher', 'admin', 'student'])
  @IsNotEmpty()
  groupName: string;
}
