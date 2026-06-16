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

  async bulkSync(items: any[], _userId: string) {
    let synced = 0
    for (const item of items) {
      const id = `qa-bug-${item.id}`
      const existing = await this.prisma.bug.findUnique({ where: { id } })

      const bugData = {
        id,
        bugId: item.issueKey || `QA-${String(synced + 1).padStart(3, '0')}`,
        title: item.title,
        description: this.buildQABugDescription(item),
        severity: this.mapQAPriority(item.priority),
        priority: this.mapQAPriority(item.priority),
        status: this.mapQAStatus(item.status, item.qaCategory),
        environment: item.project || item.client || null,
        tags: [item.client, item.sprint, item.qaCategory, item.source].filter(Boolean),
        projectId: item.project || item.client || 'manual-project',
        reporterId: _userId,
      }

      if (existing) {
        await this.prisma.bug.update({ where: { id }, data: bugData })
      } else {
        await this.prisma.bug.create({
          data: {
            ...bugData,
            bugId: bugData.bugId,
          },
        })
      }
      synced++
    }

    return { synced }
  }

  private buildQABugDescription(item: any): string {
    const parts: string[] = []
    if (item.notes) parts.push(item.notes)
    if (item.description) parts.push(`Descricao:\n${item.description}`)
    if (item.comments?.length) {
      parts.push(item.comments.slice(0, 5).map((c: any, i: number) => `Comentario ${i + 1}: ${c.body}`).join('\n\n'))
    }
    if (item.pullRequests?.length) {
      parts.push(item.pullRequests.map((p: any) => `PR: ${p.text || p.url} - ${p.url}`).join('\n'))
    }
    if (item.externalLinks?.length) {
      parts.push(item.externalLinks.map((l: any) => `Link: ${l.text || l.url} - ${l.url}`).join('\n'))
    }
    if (item.link) parts.push(`Jira: ${item.link}`)
    return parts.length > 0 ? parts.join('\n\n') : 'Bug importado via QA Importer.'
  }

  private mapQAPriority(priority: string): any {
    if (priority === 'Critical') return 'CRITICAL'
    if (priority === 'High') return 'HIGH'
    if (priority === 'Low') return 'LOW'
    return 'MEDIUM'
  }

  private mapQAStatus(status: string, qaCategory: string): any {
    const s = (status || '').toLowerCase()
    if (qaCategory === 'Done' || s.includes('done') || s.includes('closed')) return 'RESOLVED'
    if (qaCategory === 'Review' || s.includes('review')) return 'IN_REVIEW'
    if (qaCategory === 'In Testing' || s.includes('progress') || s.includes('testing')) return 'IN_PROGRESS'
    return 'OPEN'
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
