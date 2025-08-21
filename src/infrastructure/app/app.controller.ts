import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CommonApiDocResponses } from '../interface/common/utils/decorators/common-api-doc-responses.decorator';
import { CreateAppRequestDto } from 'src/domain/app/dtos/create-app-request.dto';
import { SaveAppService } from 'src/application/app/save-app.service';
import { ShowAllAppsService } from 'src/application/app/show-all-apps.service';
import { DeleteAppService } from 'src/application/app/delete-app.service';

@ApiTags('APP')
@CommonApiDocResponses()
@Controller('app')
export class AppController {
  constructor(
    private readonly saveAppService: SaveAppService,
    private readonly showAllAppsService: ShowAllAppsService,
    private readonly deleteAppService: DeleteAppService,
  ) {}

  @Post('save')
  createApp(@Body() createAppRequestDto: CreateAppRequestDto) {
    return this.saveAppService.saveApp(createAppRequestDto);
  }

  @Get('show')
  showAll() {
    return this.showAllAppsService.showAllApps();
  }

  @Get('delete/:appId')
  deleteApp(@Param('appId', ParseIntPipe) appId: number) {
    return this.deleteAppService.deleteApp(appId);
  }
}
