import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, username: true, name: true,
        avatar: true, role: true, isActive: true, lastSeen: true, createdAt: true,
      },
    })
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true, email: true, username: true, name: true,
        avatar: true, role: true, isActive: true, lastSeen: true,
      },
      orderBy: { name: 'asc' },
    })
  }

  async updateLastSeen(id: string) {
    return this.prisma.user.update({ where: { id }, data: { lastSeen: new Date() } })
  }
}
