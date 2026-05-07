import { PartialType } from '@nestjs/mapped-types'
import { IsEnum, IsInt, IsOptional, Min, Max } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ProjectStatus } from '@prisma/client'
import { CreateProjectDto } from './create-project.dto'

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number
}
