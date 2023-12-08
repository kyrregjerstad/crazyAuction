import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Register page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
  });

  test('should show password and email field errors', async ({ page }) => {
    await page.getByPlaceholder('Your name').fill('test');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText('Invalid email format.')).toBeVisible();
    await expect(page.getByText('Password must be at least 8')).toBeVisible();
  });

  test('should show invalid name, email & password errors', async ({
    page,
  }) => {
    await page.getByPlaceholder('Your email').fill('test@gmail.com');
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(
      page.getByText(
        'Name must not contain punctuation symbols apart from underscore (_).',
      ),
    ).toBeVisible();
    await expect(
      page.getByText('Email must be a valid stud.noroff.no email address.'),
    ).toBeVisible();
    await expect(
      page.getByText('Password must be at least 8 characters.'),
    ).toBeVisible();
  });

  test('should show matching password errors', async ({ page }) => {
    await page.getByPlaceholder('Your password').fill('123456789');
    await page.getByPlaceholder('Repeat password').fill('1234567890');
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByText("Passwords don't match.").click();
  });
});
