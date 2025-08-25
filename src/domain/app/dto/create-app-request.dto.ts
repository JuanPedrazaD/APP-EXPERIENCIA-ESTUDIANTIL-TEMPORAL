import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAppRequestDto {
  @ApiProperty({
    example: 'Cun móvil',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Aplicación movil de la CUN',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 1,
  })
  @IsIn([1, 0])
  @IsNotEmpty()
  state: 1 | 0;
}
