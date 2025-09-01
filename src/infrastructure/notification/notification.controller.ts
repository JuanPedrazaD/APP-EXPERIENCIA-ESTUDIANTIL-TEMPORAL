import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/application/auth/auth.guard';
import { CommonApiDocResponses } from '../interface/common/utils/decorators/common-api-doc-responses.decorator';
import { GroupNotificationService } from 'src/application/notification/send-options/push-notification/group-notification.service';
import { IndividualNotificationService } from 'src/application/notification/send-options/push-notification/individual-notification.service';
import { NotificationGroupDto } from 'src/domain/notification/dto/send/notification-group-request.dto';
import { NotificationIndividualDto } from 'src/domain/notification/dto/send/individual-group-request.dto';
import { ShowGroupsService } from 'src/application/notification/user-groups/show-growps.service';
import { UserGroupsEntity } from 'src/domain/notification/entity/user-groups.pstgs.entity';
import { SearchUserService } from 'src/application/notification/user-groups/search-user.service';
import { NotificationsByuserService } from 'src/application/notification/notifications-by-user.service';
import { NotificationByUserRequestDto } from 'src/domain/notification/dto/notification-by-user-request.dto';

@ApiTags('NOTIFICATION')
// @ApiBearerAuth()
@CommonApiDocResponses()
// @UseGuards(AuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationsByuser: NotificationsByuserService,
    private readonly showGroupsService: ShowGroupsService,
    private readonly searchUserService: SearchUserService,
    private readonly groupNotificationService: GroupNotificationService,
    private readonly individualNotificationService: IndividualNotificationService,
  ) {}

  @ApiOperation({
    summary: 'Obtener las notificaciones enviadas a un usuario',
    description:
      'Este endpoint permite obtener las notificaciones enviadas a un usuario .\n\n' +
      '**Detalles del funcionamiento:**\n' +
      '- Se buscan las notificaciones enviadas a un usuario en especifico tentiendo en cuenta:\n' +
      ' - Aplicación y ambiente de la misma, (diferentes ambientes de la misma aplicación se toma como ambientes diferentes)\n',
  })
  @HttpCode(HttpStatus.OK)
  @Get('sended-by-user')
  getNotificationsByUser(
    @Body() notificationByUserRequestDto: NotificationByUserRequestDto,
  ) {
    return this.notificationsByuser.getNotifications(
      notificationByUserRequestDto,
    );
  }

  @Post('historical')
  getNotificacions() {}

  @ApiOperation({
    summary: 'Obtener todos los grupos de usuarios para notificar',
    description:
      'Este endpoint permite obtener todos los grupos disponibles para envio de notificaciones activos .\n\n',
  })
  @HttpCode(HttpStatus.OK)
  @Get('groups')
  getGroups(): Promise<UserGroupsEntity[]> {
    return this.showGroupsService.getGroups();
  }

  //! Sacar este servicio de este controlador
  @Get('user-info/:email')
  getUser(@Param('email') email: string) {
    return this.searchUserService.getUser(email);
  }

  @Post('send/by-group')
  sendGroupNotification(@Body() notificationGroupDto: NotificationGroupDto) {
    return this.groupNotificationService.sendNotification(notificationGroupDto);
  }

  @ApiOperation({
    summary: 'Enviar notificaciones a un correo en especifico',
    description:
      'Este endpoint permite enviar notificaciones a un correo en especifico .\n\n' +
      '**Detalles del funcionamiento:**\n' +
      '- Se envían notificaciones al correo especificado.\n' +
      '- Se da la opción de guardado para la notificación.\n',
  })
  @ApiOkResponse({
    description: 'Las notificaciones fueron enviadas',
  })
  @HttpCode(HttpStatus.OK)
  @Post('send/individual')
  sendIndividualNotification(
    @Body() notificationIndividualDto: NotificationIndividualDto,
  ) {
    return this.individualNotificationService.sendNotification(
      notificationIndividualDto,
    );
  }
}
