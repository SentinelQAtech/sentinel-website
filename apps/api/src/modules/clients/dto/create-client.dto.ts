import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator'

export class CreateClientDto {
  @ApiProperty() @IsString() name!: string
  @ApiPropertyOptional() @IsOptional() @IsString() shortName?: string
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string
  @ApiPropertyOptional() @IsOptional() @IsDateString() startedAt?: string
  @ApiPropertyOptional() @IsOptional() @IsDateString() finishedAt?: string
  @ApiPropertyOptional() @IsOptional() @IsString() country?: string
  @ApiPropertyOptional() @IsOptional() @IsString() contactName?: string
  @ApiPropertyOptional() @IsOptional() @IsEmail() contactEmail?: string
  @ApiPropertyOptional() @IsOptional() @IsString() jiraUrl?: string
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string
  @ApiPropertyOptional() @IsOptional() @IsString() color?: string
}
