import { test, expect } from '@playwright/test'
import { authenticate } from './helpers/auth'

const ROUTES = [
  { label: 'Dashboard',   path: '/dashboard' },
  { label: 'Projects',    path: '/projects' },
  { label: 'Bugs',        path: '/bugs' },
  { label: 'Kanban',      path: '/kanban' },
  { label: 'Sprints',     path: '/sprints' },
  { label: 'Team',        path: '/team' },
  { label: 'Reports',     path: '/reports' },
  { label: 'Calendar',    path: '/calendar' },
  { label: 'Settings',    path: '/settings' },
]

test.describe('Navegação — Sidebar', () => {

  test.beforeEach(async ({ page }) => {
    await authenticate(page)
    await page.goto('/dashboard')
  })

  for (const { label, path } of ROUTES) {
    test(`navega para ${label} via sidebar`, async ({ page }) => {
      await page.getByRole('link', { name: label }).click()
      await expect(page).toHaveURL(path, { timeout: 8_000 })
    })
  }

  test('sidebar está visível após login', async ({ page }) => {
    const sidebar = page.locator('nav, aside').first()
    await expect(sidebar).toBeVisible()
  })

})
