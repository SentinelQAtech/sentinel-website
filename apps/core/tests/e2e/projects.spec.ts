import { test, expect } from '@playwright/test'
import { authenticate } from './helpers/auth'

test.describe('Projects', () => {

  test.beforeEach(async ({ page }) => {
    await authenticate(page)
    await page.goto('/projects')
  })

  test('página de projetos carrega sem erros', async ({ page }) => {
    await expect(page).toHaveURL('/projects')
    await expect(page.locator('body')).not.toContainText('Error')
    await expect(page.locator('body')).not.toContainText('500')
  })

  test('exibe conteúdo principal da página', async ({ page }) => {
    // Aguarda renderização do client component
    await page.waitForLoadState('networkidle')
    await expect(page.locator('main')).toBeVisible()
  })

  test('title do documento está correto', async ({ page }) => {
    await expect(page).toHaveTitle(/Projects/)
  })

})
