import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CommonApiDocResponses } from '../interface/common/utils/decorators/common-api-doc-responses.decorator';
import { SaveTokenRequestDto } from 'src/domain/fcm-token/dto/save-token-request.dto';
import { HandleTokenService } from 'src/application/cfm-token/save-token.service';

@ApiTags('CFM-TOKENS')
@CommonApiDocResponses()
@Controller('cfm-token')
export class CfmTokenController {
  constructor(private readonly saveTokenService: HandleTokenService) {}

  @ApiOperation({
    summary: 'Guardado de token CFM para notificaciones',
    description:
      'Este endpoint permite guardar o actualizar el token de un usuario de acuerdo a la app, el email y el tipo de dispositivo .\n\n' +
      '**Detalles del funcionamiento:**\n' +
      '- Se valida que el token no exista en base de datos, si tiene los mismos parametros (appId, email, deviceTypeId) se actualiza el token.\n' +
      '- Si no existe, ni coincide el token se crea, .\n',
  })
  @ApiOkResponse({
    description: 'Las notificaciones fueron enviadas',
  })
  @HttpCode(HttpStatus.OK)
  @Post('save')
  saveToken(@Body() saveTokenRequestDto: SaveTokenRequestDto): Promise<void> {
    return this.saveTokenService.handleToken(saveTokenRequestDto);
  }
}
