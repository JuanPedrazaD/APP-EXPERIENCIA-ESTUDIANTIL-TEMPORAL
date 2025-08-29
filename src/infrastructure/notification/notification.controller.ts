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

  @Get('sended/:email')
  getNotificationsByUser(@Param('email') email: string) {
    return this.notificationsByuser.getNotifications(email);
  }

  @Post('historical')
  getNotificacions() {}

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
    return this.groupNotificationService.sendNotification();
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
