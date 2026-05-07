import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'

const PROJECT_INCLUDE = {
  owner: { select: { id: true, name: true, avatar: true, email: true } },
  members: {
    include: { user: { select: { id: true, name: true, avatar: true, role: true } } },
  },
  _count: { select: { tasks: true, bugs: true, sprints: true } },
}

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjectDto, ownerId: string) {
    return this.prisma.project.create({
      data: { ...dto, ownerId },
      include: PROJECT_INCLUDE,
    })
  }

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: PROJECT_INCLUDE,
      orderBy: { updatedAt: 'desc' },
    })
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id }, include: PROJECT_INCLUDE })
    if (!project) throw new NotFoundException(`Project ${id} not found`)
    return project
  }

  async update(id: string, dto: UpdateProjectDto, userId: string) {
    const project = await this.findOne(id)
    if (project.ownerId !== userId) throw new ForbiddenException('Only the project owner can update it')
    return this.prisma.project.update({ where: { id }, data: dto, include: PROJECT_INCLUDE })
  }

  async remove(id: string, userId: string) {
    const project = await this.findOne(id)
    if (project.ownerId !== userId) throw new ForbiddenException('Only the project owner can delete it')
    return this.prisma.project.delete({ where: { id } })
  }

  async addMember(projectId: string, userId: string) {
    return this.prisma.projectMember.create({ data: { projectId, userId } })
  }

  async removeMember(projectId: string, userId: string) {
    return this.prisma.projectMember.delete({ where: { projectId_userId: { projectId, userId } } })
  }
}
