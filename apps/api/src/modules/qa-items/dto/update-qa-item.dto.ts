import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsIn, IsInt, IsObject, IsOptional, IsString } from 'class-validator'
import {
  CreateQAItemDto,
  QA_DAILY_STATUSES,
  QA_RESOLUTIONS,
  QA_WORKFLOW_STATES,
} from './create-qa-item.dto'

export class UpdateQAItemDto extends PartialType(CreateQAItemDto) {}

export class SendQAItemToDailyDto {
  @ApiPropertyOptional() @IsOptional() @IsDateString() dailyDate?: string
}

export class UpdateQAItemWorkflowStateDto {
  @ApiProperty({ enum: QA_WORKFLOW_STATES }) @IsIn(QA_WORKFLOW_STATES) workflowState!: string
}

export class UpdateQAItemDailyStatusDto {
  @ApiProperty({ enum: QA_DAILY_STATUSES }) @IsIn(QA_DAILY_STATUSES) dailyStatus!: string
}

export class RecordQAItemResolutionDto {
  @ApiProperty({ enum: QA_RESOLUTIONS }) @IsIn(QA_RESOLUTIONS) resolution!: string
  @ApiPropertyOptional() @IsOptional() @IsObject() resolutionDetails?: Record<string, unknown>
  @ApiPropertyOptional() @IsOptional() @IsObject() evidence?: Record<string, unknown>
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string
  @ApiPropertyOptional() @IsOptional() @IsString() riskLevel?: string
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string
}

export class ReorderQAItemsDto {
  @ApiProperty({ type: [String] })
  itemIds!: string[]
}
