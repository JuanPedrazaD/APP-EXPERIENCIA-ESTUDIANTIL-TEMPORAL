import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationType } from 'src/infrastructure/interface/common/utils/helpers/enums/notification-type.utils.helpers';

export class SendNotificationBaseDto {
  @ApiProperty({
    enum: NotificationType,
    example: NotificationType.NOTIFICATION,
  })
  @IsEnum(NotificationType)
  notificationType: NotificationType;

  @ApiProperty({
    example: 'Informativo',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'La sede A no estará activa el día 26/08/2025',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
