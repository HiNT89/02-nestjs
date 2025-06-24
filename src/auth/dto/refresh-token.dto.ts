import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'The refresh token to get a new access token' })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
