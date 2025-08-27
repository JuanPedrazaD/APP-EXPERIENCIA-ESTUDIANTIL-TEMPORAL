import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { CommonApiDocResponses } from '../interface/common/utils/decorators/common-api-doc-responses.decorator';
import { GroupNotificationService } from 'src/application/notification/group-notification.service';
import { IndividualNotificationService } from 'src/application/notification/individual-notification.service';
import { NotificationGroupDto } from 'src/domain/notification/dto/send/notification-group-request.dto';
import { NotificationIndividualDto } from 'src/domain/notification/dto/send/individual-group-request.dto';
import { ShowGroupsService } from 'src/application/notification/show-growps.service';
import { UserGroupsEntity } from 'src/domain/notification/entity/user-groups.pstgs.entity';
import { SearchUserService } from 'src/application/notification/search-user.service';

@ApiTags('NOTIFICATION')
@CommonApiDocResponses()
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
  getUser(@Param('email', ParseIntPipe) email: string) {
    return this.searchUserService.getUser(email);
  }

  @Post('by-group')
  sendGroupNotification(@Body() notificationGroupDto: NotificationGroupDto) {
    return this.groupNotificationService.sendNotification();
  }

  @Post('individual')
  sendIndividualNotification(
    @Body() notificationIndividualDto: NotificationIndividualDto,
  ) {
    return this.individualNotificationService.sendNotification(
      notificationIndividualDto,
    );
  }
}
