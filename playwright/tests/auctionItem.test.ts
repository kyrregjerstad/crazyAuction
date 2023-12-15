import { test, expect } from '@playwright/test';

test.describe('Auction item logged in', () => {
  test('should show the auction item', async ({ page }) => {
    await page.goto('/item/7915c95b-f37a-4886-82ff-bb67ed4af3f0');

    await expect(
      page.getByRole('heading', { name: '0000004JFGHRZVEN3G7QR2SFT5' }), // Title as UUID
    ).toBeVisible();

    await expect(page.getByTestId('current-bid')).toHaveText('$ 99');
    await expect(page.getByText('$ 99')).toBeVisible();
    await expect(page.getByText('018c6c87-b2a0-788c-9fca-')).toBeVisible(); // Description as UUID
    await expect(
      page.getByRole('heading', { name: 'Seller Information' }),
    ).toBeVisible();
    await expect(page.getByTestId('seller')).toHaveText('playwright');
    await expect(
      page.getByRole('img', { name: 'Product Image' }),
    ).toBeVisible();
  });
});

test.describe('Auction item logged out', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should show the auction item', async ({ page }) => {
    await page.goto('/item/7915c95b-f37a-4886-82ff-bb67ed4af3f0');

    await expect(
      page.getByRole('heading', { name: '0000004JFGHRZVEN3G7QR2SFT5' }), // Title as UUID
    ).toBeVisible();

    await expect(page.getByTestId('current-bid')).toHaveText('$ 99');
    await expect(page.getByText('$ 99')).toBeVisible();
    await expect(page.getByText('018c6c87-b2a0-788c-9fca-')).toBeVisible(); // Description as UUID
    await expect(
      page.getByRole('heading', { name: 'Seller Information' }),
    ).toBeVisible();
    await expect(page.getByTestId('seller')).toHaveText('playwright');
    await expect(
      page.getByRole('img', { name: 'Product Image' }),
    ).toBeVisible();

    await expect(page.getByText('This auction has ended')).toBeVisible();

    await expect(page.getByText('You must be logged in to view')).toBeVisible();
  });
});
