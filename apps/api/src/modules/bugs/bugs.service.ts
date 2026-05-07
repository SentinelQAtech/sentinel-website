import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateBugDto } from './dto/create-bug.dto'
import { UpdateBugDto } from './dto/update-bug.dto'
import { BugStatus, Priority, BugSeverity } from '@prisma/client'
import { v4 as uuid } from 'uuid'

interface BugFilters {
  projectId?: string
  severity?: BugSeverity
  priority?: Priority
  status?: BugStatus
  assigneeId?: string
  sprintId?: string
  search?: string
  page?: number
  limit?: number
}

@Injectable()
export class BugsService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateBugId(): Promise<string> {
    const count = await this.prisma.bug.count()
    return `BUG-${String(count + 1).padStart(3, '0')}`
  }

  async create(dto: CreateBugDto, reporterId: string) {
    const bugId = await this.generateBugId()
    return this.prisma.bug.create({
      data: { ...dto, bugId, reporterId },
      include: {
        reporter: { select: { id: true, name: true, avatar: true } },
        assignee: { select: { id: true, name: true, avatar: true } },
        project:  { select: { id: true, name: true, coverColor: true } },
      },
    })
  }

  async findAll(filters: BugFilters) {
    const { projectId, severity, priority, status, assigneeId, sprintId, search, page = 1, limit = 20 } = filters
    const skip = (page - 1) * limit

    const where = {
      ...(projectId && { projectId }),
      ...(severity   && { severity }),
      ...(priority   && { priority }),
      ...(status     && { status }),
      ...(assigneeId && { assigneeId }),
      ...(sprintId   && { sprintId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { bugId: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    }

    const [bugs, total] = await Promise.all([
      this.prisma.bug.findMany({
        where, skip, take: limit,
        orderBy: [
          { severity: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          reporter: { select: { id: true, name: true, avatar: true } },
          assignee: { select: { id: true, name: true, avatar: true } },
          project:  { select: { id: true, name: true, coverColor: true } },
          _count:   { select: { comments: true, attachments: true } },
        },
      }),
      this.prisma.bug.count({ where }),
    ])

    return { data: bugs, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string) {
    const bug = await this.prisma.bug.findUnique({
      where: { id },
      include: {
        reporter: { select: { id: true, name: true, avatar: true, email: true } },
        assignee: { select: { id: true, name: true, avatar: true, email: true } },
        project:  { select: { id: true, name: true, coverColor: true } },
        comments: {
          include: { author: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'asc' },
        },
        attachments: true,
        activityLogs: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!bug) throw new NotFoundException(`Bug ${id} not found`)
    return bug
  }

  async update(id: string, dto: UpdateBugDto, userId: string) {
    const bug = await this.findOne(id)

    const updated = await this.prisma.bug.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.status === 'RESOLVED' && !bug.resolvedAt && { resolvedAt: new Date() }),
      },
      include: {
        reporter: { select: { id: true, name: true, avatar: true } },
        assignee: { select: { id: true, name: true, avatar: true } },
      },
    })

    // Log activity
    await this.prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'BUG',
        entityId: id,
        description: `Bug updated`,
        userId,
        bugId: id,
      },
    })

    return updated
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.prisma.bug.delete({ where: { id } })
  }

  async getStats(projectId?: string) {
    const where = projectId ? { projectId } : {}
    const [total, open, critical, inProgress, resolved] = await Promise.all([
      this.prisma.bug.count({ where }),
      this.prisma.bug.count({ where: { ...where, status: 'OPEN' } }),
      this.prisma.bug.count({ where: { ...where, severity: 'CRITICAL' } }),
      this.prisma.bug.count({ where: { ...where, status: 'IN_PROGRESS' } }),
      this.prisma.bug.count({ where: { ...where, status: { in: ['RESOLVED', 'CLOSED'] } } }),
    ])
    return { total, open, critical, inProgress, resolved }
  }
}
