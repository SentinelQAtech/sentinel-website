import { test, expect } from '@playwright/test'
import { authenticate, CREDENTIALS } from './helpers/auth'

test.describe('Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await authenticate(page)
    await page.goto('/dashboard')
  })

  test('carrega o dashboard com saudação ao usuário', async ({ page }) => {
    const firstName = CREDENTIALS.name.split(' ')[0]
    await expect(page.getByRole('main').getByText(firstName, { exact: true })).toBeVisible()
  })

  test('exibe os filtros do dashboard', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Tudo', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Daily', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'QA', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Riscos', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sprint', exact: true })).toBeVisible()
  })

  test('filtro QA alterna widgets corretamente', async ({ page }) => {
    const filter = page.getByRole('button', { name: 'QA', exact: true })
    await filter.click()
    await expect(filter).toHaveClass(/border-primary/)
  })

  test('filtro Daily alterna widgets corretamente', async ({ page }) => {
    const filter = page.getByRole('button', { name: 'Daily', exact: true })
    await filter.click()
    await expect(filter).toHaveClass(/border-primary/)
  })

  test('botão de personalizar layout está visível', async ({ page }) => {
    await expect(page.getByTitle('Personalizar layout')).toBeVisible()
  })

})
