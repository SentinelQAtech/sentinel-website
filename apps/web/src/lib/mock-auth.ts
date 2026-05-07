import type { User } from '@/types'

// Mock users — substituir por chamada real à API quando o backend estiver conectado
const MOCK_USERS: Array<{ user: User; password: string }> = [
  {
    password: 'po90po90',
    user: {
      id: '1',
      email: 'raphael@sentinel.tech',
      username: 'raphacastilho',
      name: 'Raphael Castilho',
      avatar: undefined,
      role: 'ADMIN',
      isActive: true,
      lastSeen: new Date().toISOString(),
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  },
  {
    password: 'po90po90',
    user: {
      id: '2',
      email: 'antonio@sentinel.tech',
      username: 'antoniosilva',
      name: 'Antonio Silva',
      avatar: undefined,
      role: 'DEVELOPER',
      isActive: true,
      lastSeen: new Date().toISOString(),
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  },
]

export function validateCredentials(email: string, password: string): User | null {
  const match = MOCK_USERS.find(
    u => u.user.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  return match?.user ?? null
}
