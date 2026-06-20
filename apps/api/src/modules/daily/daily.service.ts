import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateDailyMeetingDto } from './dto/create-daily-meeting.dto'

@Injectable()
export class DailyService {
  constructor(private readonly prisma: PrismaService) {}

  private workspaceId(user: User) {
    return `user:${user.id}`
  }

  private day(date?: string) {
    const source = date ? new Date(`${date.slice(0, 10)}T12:00:00.000Z`) : new Date()
    source.setUTCHours(12, 0, 0, 0)
    return source
  }

  async listMeetings(user: User, date?: string) {
    const where: Prisma.DailyMeetingWhereInput = {
      workspaceId: this.workspaceId(user),
      ...(date && { date: this.day(date) }),
    }
    return this.prisma.dailyMeeting.findMany({
      where,
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    })
  }

  async createMeeting(dto: CreateDailyMeetingDto, user: User) {
    return this.prisma.dailyMeeting.create({
      data: {
        workspaceId: this.workspaceId(user),
        date: this.day(dto.date),
        region: dto.region ?? '',
        time: dto.time,
        title: dto.title,
        participants: dto.participants,
        notes: dto.notes,
        createdById: user.id,
        createdByAuthId: user.supabaseId,
      },
    })
  }

  async deleteMeeting(id: string, user: User) {
    const existing = await this.prisma.dailyMeeting.findFirst({
      where: { id, workspaceId: this.workspaceId(user) },
    })
    if (!existing) throw new NotFoundException(`Daily meeting ${id} not found`)
    await this.prisma.dailyMeeting.delete({ where: { id } })
    return { id }
  }
}
