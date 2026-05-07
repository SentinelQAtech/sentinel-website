import { IsEnum, IsInt, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { TaskStatus } from '@prisma/client'

export class MoveTaskDto {
  @ApiProperty({ enum: TaskStatus }) @IsEnum(TaskStatus) newStatus: TaskStatus
  @ApiProperty() @IsInt() @Min(0) newOrder: number
}
