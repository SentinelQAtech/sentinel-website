import { test, expect } from '@playwright/test'
import { CREDENTIALS } from './helpers/auth'

test.describe('Auth — Login', () => {

  test('exibe a página de login em /', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('heading', { name: 'Sentinel Core' })).toBeVisible()
    await expect(page.getByPlaceholder('seu@sentinel.tech')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()
  })

  test('redireciona /dashboard para /login quando não autenticado', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('login com credenciais válidas redireciona para /dashboard', async ({ page }) => {
    await page.goto('/login')

    await page.getByPlaceholder('seu@sentinel.tech').fill(CREDENTIALS.email)
    await page.getByPlaceholder('••••••••').fill(CREDENTIALS.password)
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL('/dashboard', { timeout: 10_000 })
  })

  test('exibe erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login')

    await page.getByPlaceholder('seu@sentinel.tech').fill('invalido@teste.com')
    await page.getByPlaceholder('••••••••').fill('senhaerrada')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.getByText('E-mail ou senha incorretos.')).toBeVisible({ timeout: 5_000 })
    await expect(page).toHaveURL('/login')
  })

  test('link para esqueceu a senha está visível', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('link', { name: 'Esqueceu a senha?' })).toBeVisible()
  })

  test('link para criar conta está visível', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('link', { name: 'Criar conta' })).toBeVisible()
  })

})
