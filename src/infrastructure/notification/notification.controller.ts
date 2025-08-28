import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/application/auth/auth.guard';
import { CommonApiDocResponses } from '../interface/common/utils/decorators/common-api-doc-responses.decorator';
import { GroupNotificationService } from 'src/application/notification/send-options/group-notification.service';
import { IndividualNotificationService } from 'src/application/notification/send-options/individual-notification.service';
import { NotificationGroupDto } from 'src/domain/notification/dto/send/notification-group-request.dto';
import { NotificationIndividualDto } from 'src/domain/notification/dto/send/individual-group-request.dto';
import { ShowGroupsService } from 'src/application/notification/groups/show-growps.service';
import { UserGroupsEntity } from 'src/domain/notification/entity/user-groups.pstgs.entity';
import { SearchUserService } from 'src/application/notification/groups/search-user.service';

@ApiTags('NOTIFICATION')
// @ApiBearerAuth()
@CommonApiDocResponses()
// @UseGuards(AuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly showGroupsService: ShowGroupsService,
    private readonly searchUserService: SearchUserService,
    private readonly groupNotificationService: GroupNotificationService,
    private readonly individualNotificationService: IndividualNotificationService,
  ) {}

  @Get('groups')
  getGroups(): Promise<UserGroupsEntity[]> {
    return this.showGroupsService.getGroups();
  }

  @Get('user/:email')
  getUser(@Param('email') email: string) {
    return this.searchUserService.getUser(email);
  }

  @Post('by-group')
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
  @Post('individual')
  sendIndividualNotification(
    @Body() notificationIndividualDto: NotificationIndividualDto,
  ) {
    return this.individualNotificationService.sendNotification(
      notificationIndividualDto,
    );
  }
}
