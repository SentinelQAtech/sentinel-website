import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export const QA_ITEM_SOURCES = ['manual', 'csv', 'extension'] as const
export const QA_WORKFLOW_STATES = ['inbox', 'planned', 'in_testing', 'review', 'blocked', 'done'] as const
export const QA_DAILY_STATUSES = ['todo', 'doing', 'blocked', 'done'] as const
export const QA_RESOLUTIONS = ['pass', 'fail', 'partial', 'blocked'] as const

export class CreateQAItemDto {
  @ApiProperty() @IsString() @MinLength(2) title!: string
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string
  @ApiPropertyOptional() @IsOptional() @IsString() clientId?: string
  @ApiPropertyOptional() @IsOptional() @IsString() clientName?: string
  @ApiPropertyOptional() @IsOptional() @IsString() projectId?: string
  @ApiPropertyOptional() @IsOptional() @IsString() sprintId?: string
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string
  @ApiPropertyOptional({ enum: QA_ITEM_SOURCES }) @IsOptional() @IsIn(QA_ITEM_SOURCES) source?: string
  @ApiPropertyOptional() @IsOptional() @IsString() externalKey?: string
  @ApiPropertyOptional() @IsOptional() @IsString() externalUrl?: string
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string
  @ApiPropertyOptional({ enum: QA_WORKFLOW_STATES }) @IsOptional() @IsIn(QA_WORKFLOW_STATES) workflowState?: string
  @ApiPropertyOptional({ enum: QA_DAILY_STATUSES }) @IsOptional() @IsIn(QA_DAILY_STATUSES) dailyStatus?: string
  @ApiPropertyOptional() @IsOptional() @IsDateString() dailyDate?: string
  @ApiPropertyOptional() @IsOptional() @IsInt() dailyOrder?: number
  @ApiPropertyOptional() @IsOptional() @IsBoolean() sentToDaily?: boolean
  @ApiPropertyOptional({ enum: QA_RESOLUTIONS }) @IsOptional() @IsIn(QA_RESOLUTIONS) resolution?: string
  @ApiPropertyOptional() @IsOptional() @IsObject() resolutionDetails?: Record<string, unknown>
  @ApiPropertyOptional() @IsOptional() @IsObject() evidence?: Record<string, unknown>
  @ApiPropertyOptional() @IsOptional() @IsString() riskLevel?: string
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string
  @ApiPropertyOptional() @IsOptional() @IsString() assigneeId?: string
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string
  @ApiPropertyOptional() @IsOptional() @IsString() itemType?: string
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>
}

export class ImportQAItemsDto {
  @ApiProperty({ type: [CreateQAItemDto] })
  @IsArray()
  items!: CreateQAItemDto[]
}
