import { IsString, IsEnum, IsOptional, IsArray, IsInt, IsDateString, MinLength, Min } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Priority, TaskStatus } from '@prisma/client'

export class CreateTaskDto {
  @ApiProperty() @IsString() @MinLength(3) title!: string
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string
  @ApiProperty({ enum: Priority }) @IsEnum(Priority) priority!: Priority
  @ApiPropertyOptional({ enum: TaskStatus }) @IsOptional() @IsEnum(TaskStatus) status?: TaskStatus
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) storyPoints?: number
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string
  @ApiProperty() @IsString() projectId!: string
  @ApiPropertyOptional() @IsOptional() @IsString() sprintId?: string
  @ApiPropertyOptional() @IsOptional() @IsString() assigneeId?: string
  @ApiPropertyOptional() @IsOptional() @IsString() parentId?: string
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[]
}
