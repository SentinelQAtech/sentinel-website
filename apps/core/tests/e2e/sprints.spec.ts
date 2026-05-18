import { test, expect } from '@playwright/test'
import { authenticate } from './helpers/auth'

test.describe('Sprints', () => {

  test.beforeEach(async ({ page }) => {
    await authenticate(page)
    await page.goto('/sprints')
  })

  test('página de sprints carrega sem erros', async ({ page }) => {
    await expect(page).toHaveURL('/sprints')
    await expect(page.locator('body')).not.toContainText('Error')
    await expect(page.locator('body')).not.toContainText('500')
  })

  test('conteúdo principal renderiza', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    await expect(page.locator('main')).toBeVisible()
  })

})
