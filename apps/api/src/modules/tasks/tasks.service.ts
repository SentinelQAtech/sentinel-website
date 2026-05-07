import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { MoveTaskDto } from './dto/move-task.dto'
import { TaskStatus } from '@prisma/client'

const TASK_INCLUDE = {
  assignee: { select: { id: true, name: true, avatar: true } },
  creator:  { select: { id: true, name: true, avatar: true } },
  subtasks: { select: { id: true, title: true, status: true } },
  _count:   { select: { comments: true, attachments: true } },
}

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto, creatorId: string) {
    const maxOrder = await this.prisma.task.aggregate({
      where: { projectId: dto.projectId, status: dto.status ?? 'BACKLOG' },
      _max: { order: true },
    })
    return this.prisma.task.create({
      data: { ...dto, creatorId, order: (maxOrder._max.order ?? -1) + 1 },
      include: TASK_INCLUDE,
    })
  }

  async findByProject(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId },
      include: TASK_INCLUDE,
      orderBy: [{ status: 'asc' }, { order: 'asc' }],
    })
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        ...TASK_INCLUDE,
        comments: { include: { author: { select: { id: true, name: true, avatar: true } } } },
        attachments: true,
      },
    })
    if (!task) throw new NotFoundException(`Task ${id} not found`)
    return task
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id)
    return this.prisma.task.update({ where: { id }, data: dto, include: TASK_INCLUDE })
  }

  async move(id: string, dto: MoveTaskDto) {
    return this.prisma.$transaction(async (tx) => {
      const task = await tx.task.findUniqueOrThrow({ where: { id } })
      const { newStatus, newOrder } = dto

      // Shift existing tasks to make room
      await tx.task.updateMany({
        where: { projectId: task.projectId, status: newStatus, order: { gte: newOrder }, id: { not: id } },
        data: { order: { increment: 1 } },
      })

      return tx.task.update({
        where: { id },
        data: { status: newStatus, order: newOrder },
        include: TASK_INCLUDE,
      })
    })
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.prisma.task.delete({ where: { id } })
  }
}
