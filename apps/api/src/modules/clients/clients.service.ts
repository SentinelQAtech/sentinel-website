import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'

const INITIAL_CLIENTS: CreateClientDto[] = [
  { name: 'UOL', shortName: 'UOL', status: 'active', startedAt: '2026-01-01', country: 'Brasil', contactName: 'Cliente UOL', color: '#ef4444' },
  { name: 'Concepta', shortName: 'CON', status: 'active', startedAt: '2026-01-01', country: 'USA', contactName: 'Cliente Concepta', color: '#3b82f6' },
  { name: 'ScrumLaunch', shortName: 'SCR', status: 'active', startedAt: '2026-01-01', country: 'Ucrania', contactName: 'Cliente ScrumLaunch', color: '#06b6d4' },
  { name: 'Ambev', shortName: 'AMB', status: 'active', startedAt: '2026-01-01', country: 'India', contactName: 'Cliente Ambev', color: '#f59e0b' },
  { name: 'Pessoal', shortName: 'PES', status: 'active', startedAt: '2026-01-01', country: 'Brasil', color: '#8b5cf6' },
]

function fallbackShortName(name: string) {
  return name.trim().slice(0, 3).toUpperCase()
}

function normalize(dto: CreateClientDto | UpdateClientDto): Prisma.ClientUncheckedCreateInput | Prisma.ClientUncheckedUpdateInput {
  const data: Record<string, unknown> = { ...dto }
  if (typeof data.name === 'string') data.name = data.name.trim()
  if (typeof data.shortName === 'string') data.shortName = data.shortName.trim().toUpperCase()
  if (!data.shortName && typeof data.name === 'string') data.shortName = fallbackShortName(data.name)
  if (typeof data.startedAt === 'string') data.startedAt = new Date(`${data.startedAt}T00:00:00.000Z`)
  if (typeof data.finishedAt === 'string') data.finishedAt = new Date(`${data.finishedAt}T00:00:00.000Z`)
  return data
}

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureInitialClients(ownerId: string) {
    const count = await this.prisma.client.count({ where: { ownerId } })
    if (count > 0) return

    await this.prisma.client.createMany({
      data: INITIAL_CLIENTS.map(client => ({
        ...normalize(client),
        ownerId,
      })) as Prisma.ClientCreateManyInput[],
      skipDuplicates: true,
    })
  }

  async create(dto: CreateClientDto, ownerId: string) {
    try {
      return await this.prisma.client.create({
        data: {
          ...normalize(dto),
          ownerId,
        } as Prisma.ClientUncheckedCreateInput,
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Client name already exists in this workspace')
      }
      throw error
    }
  }

  async findAll(ownerId: string, activeOnly = false) {
    await this.ensureInitialClients(ownerId)
    return this.prisma.client.findMany({
      where: {
        ownerId,
        ...(activeOnly ? { status: { not: 'finished' } } : {}),
      },
      orderBy: [{ status: 'asc' }, { name: 'asc' }],
    })
  }

  async findOne(id: string, ownerId: string) {
    const client = await this.prisma.client.findUnique({ where: { id } })
    if (!client) throw new NotFoundException(`Client ${id} not found`)
    if (client.ownerId !== ownerId) throw new ForbiddenException('Client belongs to another workspace')
    return client
  }

  async update(id: string, dto: UpdateClientDto, ownerId: string) {
    await this.findOne(id, ownerId)
    return this.prisma.client.update({
      where: { id },
      data: normalize(dto) as Prisma.ClientUncheckedUpdateInput,
    })
  }

  async finish(id: string, ownerId: string) {
    await this.findOne(id, ownerId)
    return this.prisma.client.update({
      where: { id },
      data: {
        status: 'finished',
        finishedAt: new Date(),
      },
    })
  }

  async remove(id: string, ownerId: string) {
    await this.findOne(id, ownerId)
    return this.prisma.client.delete({ where: { id } })
  }
}
