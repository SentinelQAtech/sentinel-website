import { test, expect } from '@playwright/test'
import { authenticate } from './helpers/auth'

test.describe('Kanban', () => {

  test.beforeEach(async ({ page }) => {
    await authenticate(page)
    await page.goto('/kanban')
  })

  test('página do kanban carrega sem erros', async ({ page }) => {
    await expect(page).toHaveURL('/kanban')
    await expect(page.locator('body')).not.toContainText('Error')
    await expect(page.locator('body')).not.toContainText('500')
  })

  test('conteúdo principal renderiza', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    await expect(page.locator('main')).toBeVisible()
  })

})
