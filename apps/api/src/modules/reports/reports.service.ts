import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { subDays, startOfDay, endOfDay, format } from 'date-fns'

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(userId: string) {
    const [
      totalProjects, activeProjects, openBugs, criticalBugs,
      tasksCompleted, tasksPending, activeSprints,
    ] = await Promise.all([
      this.prisma.project.count({ where: { OR: [{ ownerId: userId }, { members: { some: { userId } } }] } }),
      this.prisma.project.count({ where: { status: 'ACTIVE', OR: [{ ownerId: userId }, { members: { some: { userId } } }] } }),
      this.prisma.bug.count({ where: { status: 'OPEN' } }),
      this.prisma.bug.count({ where: { severity: 'CRITICAL', status: { notIn: ['RESOLVED', 'CLOSED'] } } }),
      this.prisma.task.count({ where: { status: 'DONE' } }),
      this.prisma.task.count({ where: { status: { not: 'DONE' } } }),
      this.prisma.sprint.count({ where: { status: 'ACTIVE' } }),
    ])

    return { totalProjects, activeProjects, openBugs, criticalBugs, tasksCompleted, tasksPending, activeSprints }
  }

  async getBugTrend(days = 30) {
    const points = []
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const start = startOfDay(date)
      const end = endOfDay(date)

      const [opened, closed] = await Promise.all([
        this.prisma.bug.count({ where: { createdAt: { gte: start, lte: end } } }),
        this.prisma.bug.count({ where: { resolvedAt: { gte: start, lte: end } } }),
      ])

      points.push({ date: format(date, 'dd MMM'), opened, closed })
    }
    return points
  }

  async getSprintVelocity(projectId: string, limit = 5) {
    const sprints = await this.prisma.sprint.findMany({
      where: { projectId, status: { in: ['ACTIVE', 'COMPLETED'] } },
      orderBy: { startDate: 'desc' },
      take: limit,
      include: {
        tasks: { select: { storyPoints: true, status: true } },
      },
    })

    return sprints.map(s => ({
      sprintName: s.name,
      planned: s.tasks.reduce((acc, t) => acc + (t.storyPoints ?? 0), 0),
      completed: s.tasks.filter(t => t.status === 'DONE').reduce((acc, t) => acc + (t.storyPoints ?? 0), 0),
    })).reverse()
  }

  async getTeamProductivity(projectId: string) {
    const members = await this.prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
          include: {
            assignedTasks: { where: { projectId, status: 'DONE' }, select: { storyPoints: true } },
            assignedBugs:  { where: { projectId, status: { in: ['RESOLVED', 'CLOSED'] } }, select: { id: true } },
          },
        },
      },
    })

    return members.map(m => ({
      user: { id: m.user.id, name: m.user.name, avatar: m.user.avatar },
      tasksCompleted: m.user.assignedTasks.length,
      bugsResolved:   m.user.assignedBugs.length,
      storyPoints:    m.user.assignedTasks.reduce((acc, t) => acc + (t.storyPoints ?? 0), 0),
    }))
  }
}
