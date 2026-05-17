import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshTokenDto {
  @ApiProperty() @IsString() userId!: string
  @ApiProperty() @IsString() refreshToken!: string
}
