import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { resolveSupabaseServerKey } from './supabase-config'

interface SupabaseUser {
  id: string
  email: string
  user_metadata: Record<string, any>
}

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name)
  private adminClient: any = null

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.config.get('SUPABASE_URL')
    const serverKey = resolveSupabaseServerKey({
      SUPABASE_SERVICE_ROLE_KEY: this.config.get('SUPABASE_SERVICE_ROLE_KEY'),
      SUPABASE_PUBLISHABLE_KEY: this.config.get('SUPABASE_PUBLISHABLE_KEY'),
    })

    if (supabaseUrl && serverKey) {
      const { createClient } = require('@supabase/supabase-js')
      this.adminClient = createClient(supabaseUrl, serverKey, {
        auth: { persistSession: false },
      })
      this.logger.log('Supabase admin client initialized')
    } else {
      this.logger.warn('Supabase env vars not configured — supabase bridge disabled')
    }
  }

  get isEnabled(): boolean {
    return this.adminClient !== null
  }

  async verifyToken(accessToken: string): Promise<SupabaseUser> {
    if (!this.adminClient) {
      throw new Error('Supabase bridge is not configured')
    }

    const { data, error } = await this.adminClient.auth.getUser(accessToken)

    if (error || !data?.user) {
      throw new Error(`Invalid Supabase token: ${error?.message ?? 'unknown error'}`)
    }

    const user = data.user

    return {
      id: user.id,
      email: user.email ?? '',
      user_metadata: user.user_metadata ?? {},
    }
  }
}
