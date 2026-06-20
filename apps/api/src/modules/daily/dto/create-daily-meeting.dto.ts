import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateDailyMeetingDto {
  @ApiPropertyOptional({ description: 'Daily date (YYYY-MM-DD). Defaults to today.' })
  @IsOptional()
  @IsDateString()
  date?: string

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(120) region?: string
  @ApiProperty() @IsString() @MaxLength(10) time!: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(200) title?: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) participants?: string
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(2000) notes?: string
}
