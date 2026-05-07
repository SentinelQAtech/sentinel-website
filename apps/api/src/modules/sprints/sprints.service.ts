import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateSprintDto } from './dto/create-sprint.dto'
import { UpdateSprintDto } from './dto/update-sprint.dto'

const SPRINT_INCLUDE = {
  _count: { select: { tasks: true, bugs: true, members: true } },
}

@Injectable()
export class SprintsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSprintDto) {
    return this.prisma.sprint.create({ data: dto, include: SPRINT_INCLUDE })
  }

  async findByProject(projectId: string) {
    return this.prisma.sprint.findMany({
      where: { projectId },
      include: SPRINT_INCLUDE,
      orderBy: { startDate: 'desc' },
    })
  }

  async findOne(id: string) {
    const sprint = await this.prisma.sprint.findUnique({
      where: { id },
      include: {
        tasks: {
          include: { assignee: { select: { id: true, name: true, avatar: true } } },
          orderBy: { order: 'asc' },
        },
        bugs: {
          select: { id: true, bugId: true, title: true, severity: true, status: true },
        },
        members: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        _count: { select: { tasks: true, bugs: true } },
      },
    })
    if (!sprint) throw new NotFoundException(`Sprint ${id} not found`)
    return sprint
  }

  async update(id: string, dto: UpdateSprintDto) {
    await this.findOne(id)

    if (dto.status === 'ACTIVE') {
      const activeSprints = await this.prisma.sprint.count({
        where: { projectId: (await this.findOne(id)).projectId, status: 'ACTIVE', id: { not: id } },
      })
      if (activeSprints > 0) throw new BadRequestException('A sprint is already active for this project')
    }

    return this.prisma.sprint.update({ where: { id }, data: dto, include: SPRINT_INCLUDE })
  }

  async getBurndown(id: string) {
    const sprint = await this.findOne(id)
    const tasks = await this.prisma.task.findMany({
      where: { sprintId: id },
      select: { status: true, storyPoints: true, updatedAt: true },
    })

    const totalPoints = tasks.reduce((acc, t) => acc + (t.storyPoints ?? 0), 0)
    const completedPoints = tasks
      .filter(t => t.status === 'DONE')
      .reduce((acc, t) => acc + (t.storyPoints ?? 0), 0)

    return { totalPoints, completedPoints, sprint }
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.prisma.sprint.delete({ where: { id } })
  }
}
