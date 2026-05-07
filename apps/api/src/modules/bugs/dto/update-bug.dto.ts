import { PartialType } from '@nestjs/mapped-types'
import { IsEnum, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { BugStatus } from '@prisma/client'
import { CreateBugDto } from './create-bug.dto'

export class UpdateBugDto extends PartialType(CreateBugDto) {
  @ApiPropertyOptional({ enum: BugStatus })
  @IsOptional()
  @IsEnum(BugStatus)
  status?: BugStatus
}
