import { test, expect } from '@playwright/test'
import { authenticate } from './helpers/auth'

test.describe('Bugs — QA', () => {

  test.beforeEach(async ({ page }) => {
    await authenticate(page)
    await page.goto('/bugs')
  })

  test('página de bugs carrega sem erros', async ({ page }) => {
    await expect(page).toHaveURL('/bugs')
    await expect(page.locator('body')).not.toContainText('Error')
    await expect(page.locator('body')).not.toContainText('500')
  })

  test('conteúdo principal renderiza', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    await expect(page.locator('main')).toBeVisible()
  })

  test('navega de volta para dashboard', async ({ page }) => {
    await page.getByRole('link', { name: 'Dashboard' }).click()
    await expect(page).toHaveURL('/dashboard', { timeout: 8_000 })
  })

})
