import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { LoginService } from 'src/application/auth/login.service';
import { RegisterService } from 'src/application/auth/register.service';
import { AuthRequestDto } from 'src/domain/auth/dtos/auth-request.dto';
import { AuthResponseDto } from 'src/domain/auth/dtos/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
  ) {}

  @ApiOperation({
    summary: 'Inicio de sesión plataformas web',
    description:
      'Este servicio permite iniciar sesión a plataformas web utilizando credenciales. El sistema valida las credenciales ingresadas con la información almacenada en una base de datos Oracle y, en caso de ser correctas, devuelve un token de acceso.',
  })
  @ApiBody({
    type: AuthRequestDto,
    description:
      'Datos requeridos para el inicio de sesión. Incluye el usuario y la contraseña de la plataforma.',
  })
  @ApiOkResponse({
    type: AuthResponseDto,
    description:
      'Estructura de la respuesta en caso de que el inicio de sesión sea exitoso. Incluye un token de acceso y el identificador de la plataforma.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  sigIn(@Body() authRequestDto: AuthRequestDto) {
    return this.loginService.signIn(authRequestDto);
  }

  @ApiOperation({
    summary: 'Registro de recursos externos',
    description:
      'Este servicio permite registrar nuevas plataformas web en el sistema. La información proporcionada se almacena en una base de datos Oracle.',
  })
  @ApiBody({
    type: AuthRequestDto,
    description:
      'Estructura de los datos requeridos para registrar un usuario. Incluye el usuario y la contraseña que serán utilizados para futuras autenticaciones.',
  })
  @ApiOkResponse({
    type: AuthResponseDto,
    description:
      'Estructura de la respuesta en caso de que el registro sea exitoso. Incluye un token de acceso y el identificador de la plataforma recién registrado.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiExcludeEndpoint()
  register(@Body() authRequestDto: AuthRequestDto) {
    return this.registerService.register(authRequestDto);
  }
}
