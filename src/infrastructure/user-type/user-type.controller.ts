import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CommonApiDocResponses } from '../interface/common/utils/decorators/common-api-doc-responses.decorator';
import { CreateAppRequestDto } from 'src/domain/app/dtos/create-app-request.dto';
import { SaveAppService } from 'src/application/app/save-app.service';
import { ShowAllAppsService } from 'src/application/app/show-all-apps.service';
import { DeleteAppService } from 'src/application/app/delete-app.service';
import { UpdateAppRequestDto } from 'src/domain/app/dtos/update-app-request.dto';
import { UpdateAppService } from 'src/application/app/update-app.service';

@ApiTags('APP')
@CommonApiDocResponses()
@Controller('app')
export class UserTypeController {
  constructor() // private readonly showAllAppsService: ShowAllAppsService, // private readonly saveAppService: SaveAppService,
  // private readonly updateAppService: UpdateAppService,
  // private readonly deleteAppService: DeleteAppService,
  {}

  @HttpCode(HttpStatus.CREATED)
  @Post('save')
  createApp(@Body() createAppRequestDto: CreateAppRequestDto) {
    // return this.saveAppService.saveApp(createAppRequestDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('show')
  showAll() {
    // return this.showAllAppsService.showAllApps();
  }

  @HttpCode(HttpStatus.OK)
  @Patch('update')
  updateApp(@Body() updateAppRequestDto: UpdateAppRequestDto) {
    // return this.updateAppService.updateApp(updateAppRequestDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete/:appId')
  deleteApp(@Param('appId', ParseIntPipe) appId: number) {
    // return this.deleteAppService.deleteApp(appId);
  }
}
