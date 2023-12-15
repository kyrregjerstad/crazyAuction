import { test, expect } from '@playwright/test';

test.describe('Profile page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/user/playwright`);
  });

  test('should show user profile', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'playwright' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Credits' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: '1 auction' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Active Auctions' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Wins' })).toBeVisible();

    expect(page.getByRole('button', { name: 'Edit' })).toBeDefined();
  });
});
