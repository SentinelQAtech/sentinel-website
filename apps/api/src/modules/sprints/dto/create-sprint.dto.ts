import { IsString, IsOptional, IsDateString, IsInt, Min, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateSprintDto {
  @ApiProperty() @IsString() @MinLength(3) name: string
  @ApiPropertyOptional() @IsOptional() @IsString() goal?: string
  @ApiProperty() @IsDateString() startDate: string
  @ApiProperty() @IsDateString() endDate: string
  @ApiProperty() @IsString() projectId: string
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) capacity?: number
}
