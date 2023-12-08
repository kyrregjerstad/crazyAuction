import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login page', () => {
  test('should show invalid field errors', async ({ page, context }) => {
    await page.goto('/auth/login');
    await expect(
      page.getByRole('heading', { name: 'Login to CrazyAuction' }),
    ).toBeVisible();

    await page
      .getByPlaceholder('your-email@stud.noroff.no')
      .fill('wrong-email@gmail.com');

    await page.getByPlaceholder('Password').fill('123456789');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(
      page.getByText('Email must end with @stud.noroff.no'),
    ).toBeVisible();

    const cookies = await context.cookies();

    expect(
      cookies.find((cookie) => cookie.name === 'next-auth.session-token'),
    ).toBeFalsy();
  });

  test('should reject invalid credentials', async ({ page, context }) => {
    await page.goto('/auth/login');
    await expect(
      page.getByRole('heading', { name: 'Login to CrazyAuction' }),
    ).toBeVisible();

    await page
      .getByPlaceholder('your-email@stud.noroff.no')
      .fill('your-email@stud.noroff.no');

    await page.getByPlaceholder('Password').fill('randomPassword');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(
      page.getByText('Email and password combination not found'),
    ).toBeVisible();

    const cookies = await context.cookies();

    expect(
      cookies.find((cookie) => cookie.name === 'next-auth.session-token'),
    ).toBeFalsy();
  });
});
