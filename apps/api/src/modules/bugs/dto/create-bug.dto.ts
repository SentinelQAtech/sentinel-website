import { IsString, IsEnum, IsOptional, IsArray, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BugSeverity, Priority } from '@prisma/client'

export class CreateBugDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  title!: string

  @ApiProperty()
  @IsString()
  @MinLength(10)
  description!: string

  @ApiProperty({ enum: BugSeverity })
  @IsEnum(BugSeverity)
  severity!: BugSeverity

  @ApiProperty({ enum: Priority })
  @IsEnum(Priority)
  priority!: Priority

  @ApiProperty()
  @IsString()
  projectId!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  environment?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stepsToReproduce?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  expectedBehavior?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actualBehavior?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  browserInfo?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  osInfo?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buildVersion?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assigneeId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sprintId?: string

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]
}
