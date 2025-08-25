import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SaveTokenRequestDto {
  @ApiProperty({
    example: 'hdhabvdhsabcjnavnanfabfahfbajl',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  appId: number;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  deviceId: number;

  @ApiProperty({
    example: 'jhon.doe@cun.edu.co',
  })
  @IsString()
  @IsNotEmpty()
  userEmail: string;
}
