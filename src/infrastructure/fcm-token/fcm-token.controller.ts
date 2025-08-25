import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CommonApiDocResponses } from '../interface/common/utils/decorators/common-api-doc-responses.decorator';
import { SaveTokenRequestDto } from 'src/domain/fcm-token/dto/save-token-request.dto';
import { HandleTokenService } from 'src/application/cfm-token/save-token.service';

@ApiTags('CFM-TOKENS')
@CommonApiDocResponses()
@Controller('cfm-token')
export class CfmTokenController {
  constructor(private readonly saveTokenService: HandleTokenService) {}

  @Post('save')
  saveToken(@Body() saveTokenRequestDto: SaveTokenRequestDto) {
    return this.saveTokenService.handleToken(saveTokenRequestDto);
  }
}
