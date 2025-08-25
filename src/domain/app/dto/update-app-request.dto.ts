import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateAppRequestDto {
  @ApiProperty({
    example: 12,
  })
  @IsNumber()
  @IsNotEmpty()
  appId: number;

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
