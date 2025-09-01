import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class NotificationByUserRequestDto {
  @ApiProperty({
    example: 'jhon_doe@cun.edu.co',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  appId: number;
}
