import { IsString, IsEnum, IsOptional, IsArray, IsDateString, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ProjectStatus, Priority } from '@prisma/client'

export class CreateProjectDto {
  @ApiProperty() @IsString() @MinLength(2) name: string
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string
  @ApiProperty({ enum: Priority }) @IsEnum(Priority) priority: Priority
  @ApiPropertyOptional() @IsOptional() @IsDateString() startDate?: string
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string
  @ApiPropertyOptional() @IsOptional() @IsString() clientName?: string
  @ApiPropertyOptional() @IsOptional() @IsString() coverColor?: string
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() tags?: string[]
}
