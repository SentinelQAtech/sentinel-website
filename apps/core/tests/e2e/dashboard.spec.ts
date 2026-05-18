import { test, expect } from '@playwright/test'
import { authenticate, CREDENTIALS } from './helpers/auth'

test.describe('Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await authenticate(page)
    await page.goto('/dashboard')
  })

  test('carrega o dashboard com saudação ao usuário', async ({ page }) => {
    const firstName = CREDENTIALS.name.split(' ')[0]
    await expect(page.getByText(firstName)).toBeVisible()
  })

  test('exibe os filtros do dashboard', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Tudo' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Daily' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'QA' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Riscos' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sprint' })).toBeVisible()
  })

  test('filtro QA alterna widgets corretamente', async ({ page }) => {
    await page.getByRole('button', { name: 'QA' }).click()
    await expect(page.getByRole('button', { name: 'QA' })).toHaveClass(/border-primary/)
  })

  test('filtro Daily alterna widgets corretamente', async ({ page }) => {
    await page.getByRole('button', { name: 'Daily' }).click()
    await expect(page.getByRole('button', { name: 'Daily' })).toHaveClass(/border-primary/)
  })

  test('botão de personalizar layout está visível', async ({ page }) => {
    await expect(page.getByTitle('Personalizar layout')).toBeVisible()
  })

})
