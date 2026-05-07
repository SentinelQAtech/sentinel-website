import { PartialType } from '@nestjs/mapped-types'
import { IsEnum, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { SprintStatus } from '@prisma/client'
import { CreateSprintDto } from './create-sprint.dto'

export class UpdateSprintDto extends PartialType(CreateSprintDto) {
  @ApiPropertyOptional({ enum: SprintStatus })
  @IsOptional()
  @IsEnum(SprintStatus)
  status?: SprintStatus
}
