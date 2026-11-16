import { expect, test } from '@playwright/test';
import crypto from 'node:crypto';

function createValidUser() {
  const hash = crypto.randomBytes(20).toString('hex');

  return {
    name: `Valid ${hash}`,
    email: `valid-${hash}@email.com`,
    password: '12345678',
  };
}

test.describe('Invest App', () => {
  let validUser;

  test.beforeAll(() => {
    validUser = createValidUser();
  });

  test('should sign up, sign in, and manage investments', async ({ page }) => {
    const investmentName = `Tesouro E2E ${Date.now()}`;

    // Signup
    await page.goto('/signup.html');
    await page.getByLabel('Nome').fill(validUser.name);
    await page.getByLabel('Email').fill(validUser.email);
    await page.getByLabel('Senha', { exact: true }).fill(validUser.password);
    await page.getByLabel('Confirmar Senha').fill(validUser.password);
    await page.getByRole('button', { name: 'Cadastrar' }).click();
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();

    // Signin
    await page.getByLabel('Email').fill(validUser.email);
    await page.getByLabel('Senha').fill(validUser.password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(
      page.getByRole('heading', { name: 'Investimentos' }),
    ).toBeVisible();

    // Home - Add Investment
    await page.getByRole('button', { name: 'Criar investimento' }).click();
    await page.getByLabel('Nome').fill(investmentName);
    await page.getByLabel('Valor').fill('155');
    await page.getByLabel('Taxa').fill('100% Selic');
    await page.getByLabel('Vencimento').fill('2029-03-01');
    await page.getByLabel('Categoria').selectOption({ index: 1 });
    await page.getByLabel('Corretora').selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Salvar investimento' }).click();

    await expect(page.getByText(investmentName)).toBeVisible();
    await expect(page.getByText('R$ 155,00')).toBeVisible();

    // Delete Investment
    await page.getByRole('button', { name: 'Remover investimento' }).click();
    await page.getByRole('button', { name: 'Confirmar' }).click();

    await expect(page.getByText(investmentName)).not.toBeVisible();
    await expect(page.getByText('Nenhum investimento cadastrado.')).toBeVisible();
  });
});
