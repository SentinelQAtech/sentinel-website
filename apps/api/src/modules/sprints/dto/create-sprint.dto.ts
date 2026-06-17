import { IsString, IsOptional, IsDateString, IsInt, Min, MinLength, IsEnum } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { SprintStatus } from '@prisma/client'

export class CreateSprintDto {
  @ApiProperty() @IsString() @MinLength(3) name!: string
  @ApiPropertyOptional() @IsOptional() @IsString() goal?: string
  @ApiProperty() @IsDateString() startDate!: string
  @ApiProperty() @IsDateString() endDate!: string
  @ApiProperty() @IsString() projectId!: string
  @ApiPropertyOptional({ enum: SprintStatus }) @IsOptional() @IsEnum(SprintStatus) status?: SprintStatus
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) capacity?: number
}
