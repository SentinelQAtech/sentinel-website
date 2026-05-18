import type { Page } from '@playwright/test'

const MOCK_USER = {
  id: '1',
  email: 'raphael@sentinel.tech',
  username: 'raphacastilho',
  name: 'Raphael Castilho',
  avatar: null,
  role: 'ADMIN',
  isActive: true,
  lastSeen: new Date().toISOString(),
  createdAt: '2026-01-01T00:00:00.000Z',
}

/** Injeta o estado de auth no localStorage antes de qualquer render.
 *  Evita passar pelo fluxo de login em cada teste. */
export async function authenticate(page: Page) {
  await page.addInitScript((user) => {
    const authState = JSON.stringify({
      state: { user, isAuthenticated: true },
      version: 0,
    })
    localStorage.setItem('sentinel-core-auth', authState)
  }, MOCK_USER)
}

export const CREDENTIALS = {
  email:    'raphael@sentinel.tech',
  password: 'po90po90',
  name:     'Raphael Castilho',
}
