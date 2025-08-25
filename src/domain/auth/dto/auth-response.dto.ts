import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'username',
  })
  username: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInVzZXJuYW1lIjoiZnJvbnRfMzYwIiwiaWF0IjoxNzI0ODc1ODMxLCJleHAiOjE3MjQ4Nzk0MzF9.XZgcNyueFSMPHLIjTS8uRrEms0g2aG8pggKJ2hmRu1E',
  })
  access_token: string;
}
