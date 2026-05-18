import { test, expect } from '@playwright/test'
import { authenticate } from './helpers/auth'

const ROUTES = [
  { label: 'Dashboard',     path: '/dashboard' },
  { label: 'Projetos',      path: '/projects' },
  { label: 'Bugs',          path: '/bugs' },
  { label: 'Board',         path: '/kanban' },
  { label: 'Sprints',       path: '/sprints' },
  { label: 'Time',          path: '/team' },
  { label: 'Relatórios',    path: '/reports' },
  { label: 'Calendário',    path: '/calendar' },
  { label: 'Configurações', path: '/settings' },
]

test.describe('Navegação — Sidebar', () => {

  test.beforeEach(async ({ page }) => {
    await authenticate(page)
    await page.goto('/dashboard')
  })

  for (const { label, path } of ROUTES) {
    test(`navega para ${label} via sidebar`, async ({ page }) => {
      await page.getByRole('link', { name: label, exact: true }).click()
      await expect(page).toHaveURL(path, { timeout: 8_000 })
    })
  }

  test('sidebar está visível após login', async ({ page }) => {
    const sidebar = page.locator('nav, aside').first()
    await expect(sidebar).toBeVisible()
  })

})
