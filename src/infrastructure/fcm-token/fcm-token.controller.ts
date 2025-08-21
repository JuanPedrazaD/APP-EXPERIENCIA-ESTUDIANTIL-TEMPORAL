import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CommonApiDocResponses } from '../interface/common/utils/decorators/common-api-doc-responses.decorator';

@ApiTags('CFM-TOKENS')
@CommonApiDocResponses()
@Controller('cfm-token')
export class CfmTokenController {
  constructor() {}

  @Post('save')
  getSchedules() {}
}
