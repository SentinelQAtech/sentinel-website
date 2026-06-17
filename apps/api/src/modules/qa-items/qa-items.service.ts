import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateQAItemDto, ImportQAItemsDto } from './dto/create-qa-item.dto'
import {
  RecordQAItemResolutionDto,
  SendQAItemToDailyDto,
  UpdateQAItemDailyStatusDto,
  UpdateQAItemDto,
  UpdateQAItemWorkflowStateDto,
} from './dto/update-qa-item.dto'

const QA_ITEM_INCLUDE = {
  project: { select: { id: true, name: true, coverColor: true } },
  sprint: { select: { id: true, name: true, status: true } },
  assignee: { select: { id: true, name: true, avatar: true, email: true } },
  createdBy: { select: { id: true, name: true, email: true, supabaseId: true } },
  _count: { select: { bugs: true } },
} satisfies Prisma.QAItemInclude

interface QAItemFilters {
  projectId?: string
  sprintId?: string
  workflowState?: string
  dailyDate?: string
  sentToDaily?: string
  priority?: string
  status?: string
  search?: string
  includeArchived?: string
}

@Injectable()
export class QAItemsService {
  constructor(private readonly prisma: PrismaService) {}

  private workspaceId(user: User) {
    return `user:${user.id}`
  }

  private assertWorkspace(user: User, workspaceId?: string) {
    const expected = this.workspaceId(user)
    if (workspaceId && workspaceId !== expected) {
      throw new ForbiddenException('Invalid workspace for current user')
    }
    return expected
  }

  private today(date?: string) {
    const source = date ? new Date(`${date.slice(0, 10)}T12:00:00.000Z`) : new Date()
    source.setUTCHours(12, 0, 0, 0)
    return source
  }

  private workflowFromCategory(category?: string) {
    if (category === 'Done') return 'done'
    if (category === 'Blocked') return 'blocked'
    if (category === 'Review') return 'review'
    if (category === 'In Testing' || category === 'Bug Validation' || category === 'Regression') return 'in_testing'
    return 'inbox'
  }

  private categoryFromWorkflow(workflowState: string) {
    if (workflowState === 'done') return 'Done'
    if (workflowState === 'blocked') return 'Blocked'
    if (workflowState === 'review') return 'Review'
    if (workflowState === 'in_testing') return 'In Testing'
    if (workflowState === 'planned') return 'Ready for QA'
    return 'Ready for QA'
  }

  private dailyFromWorkflow(workflowState: string) {
    if (workflowState === 'done') return 'done'
    if (workflowState === 'blocked') return 'blocked'
    if (workflowState === 'in_testing' || workflowState === 'review') return 'doing'
    return 'todo'
  }

  private workflowFromDaily(dailyStatus: string) {
    if (dailyStatus === 'done') return 'done'
    if (dailyStatus === 'blocked') return 'blocked'
    if (dailyStatus === 'doing') return 'in_testing'
    return 'planned'
  }

  private normalizeCreate(dto: CreateQAItemDto, user: User): Prisma.QAItemUncheckedCreateInput {
    const category = dto.category ?? 'Other'
    const workflowState = dto.workflowState ?? this.workflowFromCategory(category)
    return {
      workspaceId: this.assertWorkspace(user, dto.workspaceId),
      clientId: dto.clientId,
      clientName: dto.clientName,
      projectId: dto.projectId,
      sprintId: dto.sprintId,
      title: dto.title,
      description: dto.description,
      source: dto.source ?? 'manual',
      externalKey: dto.externalKey,
      externalUrl: dto.externalUrl,
      priority: dto.priority ?? 'Unknown',
      category,
      status: dto.status ?? category,
      workflowState,
      dailyStatus: dto.dailyStatus,
      dailyDate: dto.dailyDate ? this.today(dto.dailyDate) : undefined,
      dailyOrder: dto.dailyOrder,
      sentToDaily: dto.sentToDaily ?? false,
      resolution: dto.resolution,
      resolutionDetails: dto.resolutionDetails as Prisma.InputJsonValue | undefined,
      evidence: dto.evidence as Prisma.InputJsonValue | undefined,
      riskLevel: dto.riskLevel,
      severity: dto.severity,
      assigneeId: dto.assigneeId,
      createdById: user.id,
      createdByAuthId: user.supabaseId,
      notes: dto.notes,
      itemType: dto.itemType,
      metadata: dto.metadata as Prisma.InputJsonValue | undefined,
    }
  }

  private normalizeUpdate(dto: UpdateQAItemDto): Prisma.QAItemUncheckedUpdateInput {
    const workflowState = dto.workflowState ?? (dto.category ? this.workflowFromCategory(dto.category) : undefined)
    return {
      clientId: dto.clientId,
      clientName: dto.clientName,
      projectId: dto.projectId,
      sprintId: dto.sprintId,
      title: dto.title,
      description: dto.description,
      source: dto.source,
      externalKey: dto.externalKey,
      externalUrl: dto.externalUrl,
      priority: dto.priority,
      category: dto.category,
      status: dto.status ?? dto.category,
      workflowState,
      dailyStatus: dto.dailyStatus,
      dailyDate: dto.dailyDate ? this.today(dto.dailyDate) : undefined,
      dailyOrder: dto.dailyOrder,
      sentToDaily: dto.sentToDaily,
      resolution: dto.resolution,
      resolutionDetails: dto.resolutionDetails as Prisma.InputJsonValue | undefined,
      evidence: dto.evidence as Prisma.InputJsonValue | undefined,
      riskLevel: dto.riskLevel,
      severity: dto.severity,
      assigneeId: dto.assigneeId,
      notes: dto.notes,
      itemType: dto.itemType,
      metadata: dto.metadata as Prisma.InputJsonValue | undefined,
    }
  }

  async list(user: User, filters: QAItemFilters) {
    const where: Prisma.QAItemWhereInput = {
      workspaceId: this.workspaceId(user),
      ...(filters.includeArchived === 'true' ? {} : { deletedAt: null, archivedAt: null }),
      ...(filters.projectId && { projectId: filters.projectId }),
      ...(filters.sprintId && { sprintId: filters.sprintId }),
      ...(filters.workflowState && { workflowState: filters.workflowState }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.status && { status: filters.status }),
      ...(filters.sentToDaily !== undefined && { sentToDaily: filters.sentToDaily === 'true' }),
      ...(filters.dailyDate && { dailyDate: this.today(filters.dailyDate) }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { externalKey: { contains: filters.search, mode: 'insensitive' } },
          { notes: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    }

    return this.prisma.qAItem.findMany({
      where,
      include: QA_ITEM_INCLUDE,
      orderBy: [{ dailyOrder: 'asc' }, { updatedAt: 'desc' }],
    })
  }

  async get(id: string, user: User) {
    const item = await this.prisma.qAItem.findFirst({
      where: { id, workspaceId: this.workspaceId(user), deletedAt: null },
      include: QA_ITEM_INCLUDE,
    })
    if (!item) throw new NotFoundException(`QA item ${id} not found`)
    return item
  }

  async create(dto: CreateQAItemDto, user: User) {
    const existing = dto.externalKey
      ? await this.prisma.qAItem.findFirst({
          where: { workspaceId: this.workspaceId(user), externalKey: dto.externalKey, deletedAt: null },
        })
      : null

    if (existing) {
      return this.prisma.qAItem.update({
        where: { id: existing.id },
        data: this.normalizeUpdate(dto),
        include: QA_ITEM_INCLUDE,
      })
    }

    return this.prisma.qAItem.create({
      data: this.normalizeCreate(dto, user),
      include: QA_ITEM_INCLUDE,
    })
  }

  async import(dto: ImportQAItemsDto, user: User) {
    const items = []
    let added = 0
    let updated = 0

    for (const item of dto.items) {
      const existing = item.externalKey
        ? await this.prisma.qAItem.findFirst({
            where: { workspaceId: this.workspaceId(user), externalKey: item.externalKey, deletedAt: null },
          })
        : null

      if (existing) {
        items.push(await this.prisma.qAItem.update({
          where: { id: existing.id },
          data: this.normalizeUpdate(item),
          include: QA_ITEM_INCLUDE,
        }))
        updated++
      } else {
        items.push(await this.prisma.qAItem.create({
          data: this.normalizeCreate(item, user),
          include: QA_ITEM_INCLUDE,
        }))
        added++
      }
    }

    return { items, added, updated, total: dto.items.length, skipped: 0 }
  }

  async update(id: string, dto: UpdateQAItemDto, user: User) {
    await this.get(id, user)
    return this.prisma.qAItem.update({
      where: { id },
      data: this.normalizeUpdate(dto),
      include: QA_ITEM_INCLUDE,
    })
  }

  async archive(id: string, user: User) {
    await this.get(id, user)
    return this.prisma.qAItem.update({
      where: { id },
      data: { archivedAt: new Date(), deletedAt: new Date() },
      include: QA_ITEM_INCLUDE,
    })
  }

  async sendToDaily(id: string, dto: SendQAItemToDailyDto, user: User) {
    await this.get(id, user)
    const dailyDate = this.today(dto.dailyDate)
    const maxOrder = await this.prisma.qAItem.aggregate({
      where: { workspaceId: this.workspaceId(user), sentToDaily: true, dailyDate, deletedAt: null },
      _max: { dailyOrder: true },
    })

    return this.prisma.qAItem.update({
      where: { id },
      data: {
        sentToDaily: true,
        dailyDate,
        dailyOrder: (maxOrder._max.dailyOrder ?? -1) + 1,
        dailyStatus: 'todo',
        workflowState: 'planned',
        category: 'Ready for QA',
        status: 'Ready for QA',
      },
      include: QA_ITEM_INCLUDE,
    })
  }

  async updateWorkflowState(id: string, dto: UpdateQAItemWorkflowStateDto, user: User) {
    await this.get(id, user)
    const category = this.categoryFromWorkflow(dto.workflowState)
    return this.prisma.qAItem.update({
      where: { id },
      data: {
        workflowState: dto.workflowState,
        category,
        status: category,
        dailyStatus: this.dailyFromWorkflow(dto.workflowState),
      },
      include: QA_ITEM_INCLUDE,
    })
  }

  async updateDailyStatus(id: string, dto: UpdateQAItemDailyStatusDto, user: User) {
    await this.get(id, user)
    const workflowState = this.workflowFromDaily(dto.dailyStatus)
    const category = this.categoryFromWorkflow(workflowState)
    return this.prisma.qAItem.update({
      where: { id },
      data: {
        dailyStatus: dto.dailyStatus,
        workflowState,
        category,
        status: category,
      },
      include: QA_ITEM_INCLUDE,
    })
  }

  async moveDailyItem(id: string, direction: 'up' | 'down', user: User) {
    const current = await this.get(id, user)
    if (!current.dailyDate) return current
    const items = await this.prisma.qAItem.findMany({
      where: { workspaceId: this.workspaceId(user), sentToDaily: true, dailyDate: current.dailyDate, deletedAt: null },
      orderBy: [{ dailyOrder: 'asc' }, { updatedAt: 'asc' }],
    })
    const index = items.findIndex(item => item.id === id)
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (index < 0 || targetIndex < 0 || targetIndex >= items.length) return current

    const next = [...items]
    const [moved] = next.splice(index, 1)
    next.splice(targetIndex, 0, moved)

    await this.prisma.$transaction(
      next.map((item, dailyOrder) =>
        this.prisma.qAItem.update({ where: { id: item.id }, data: { dailyOrder } }),
      ),
    )
    return this.get(id, user)
  }

  async recordResolution(id: string, dto: RecordQAItemResolutionDto, user: User) {
    await this.get(id, user)
    const workflowState = dto.resolution === 'pass' ? 'done' : 'blocked'
    const category = dto.category ?? (dto.resolution === 'fail' ? 'Bug Validation' : this.categoryFromWorkflow(workflowState))
    return this.prisma.qAItem.update({
      where: { id },
      data: {
        resolution: dto.resolution,
        resolutionDetails: dto.resolutionDetails as Prisma.InputJsonValue | undefined,
        evidence: dto.evidence as Prisma.InputJsonValue | undefined,
        severity: dto.severity,
        riskLevel: dto.riskLevel,
        workflowState,
        category,
        status: dto.status ?? category,
        dailyStatus: workflowState === 'done' ? 'done' : 'blocked',
      },
      include: QA_ITEM_INCLUDE,
    })
  }
}
