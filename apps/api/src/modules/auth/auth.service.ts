import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { PrismaService } from '../../prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { SupabaseService } from './supabase/supabase.service'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email)
    if (!user) throw new UnauthorizedException('Invalid credentials')
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid credentials')
    return user
  }

  async login(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = this.jwt.sign(payload)
    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    })

    const hashedRefresh = await bcrypt.hash(refreshToken, 10)
    await this.prisma.user.update({ where: { id: user.id }, data: { refreshToken: hashedRefresh } })

    return { accessToken, refreshToken }
  }

  async register(dto: RegisterDto) {
    const existing = await this.users.findByEmail(dto.email)
    if (existing) throw new ConflictException('Email already in use')

    const passwordHash = await bcrypt.hash(dto.password, 12)
    const user = await this.prisma.user.create({
      data: { email: dto.email, username: dto.username, name: dto.name, passwordHash },
    })

    return this.login(user)
  }

  async supabaseLogin(accessToken: string) {
    if (!this.supabase.isEnabled) {
      throw new UnauthorizedException('Supabase auth bridge is not configured')
    }

    const supabaseUser = await this.supabase.verifyToken(accessToken)

    if (!supabaseUser.email) {
      throw new UnauthorizedException('Supabase user has no email')
    }

    // Find or create local user linked by email
    let localUser = await this.users.findByEmail(supabaseUser.email)

    if (localUser) {
      // Update Supabase ID if not set
      await this.prisma.user.update({
        where: { id: localUser.id },
        data: { lastSeen: new Date() },
      })
    } else {
      // Create new local user from Supabase data
      const metadata = supabaseUser.user_metadata
      const username = metadata?.username
        ?? supabaseUser.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '_')

      const dummyHash = await bcrypt.hash(crypto.randomUUID(), 12)

      localUser = await this.prisma.user.create({
        data: {
          email: supabaseUser.email,
          username,
          name: metadata?.full_name ?? metadata?.name ?? username,
          passwordHash: dummyHash,
          role: 'DEVELOPER',
        },
      })

      this.logger.log(`Created local user from Supabase: ${supabaseUser.email}`)
    }

    return this.login({ id: localUser.id, email: localUser.email, role: localUser.role })
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user?.refreshToken) throw new UnauthorizedException()

    const valid = await bcrypt.compare(refreshToken, user.refreshToken)
    if (!valid) throw new UnauthorizedException()

    return this.login(user)
  }

  async logout(userId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { refreshToken: null } })
  }
}
