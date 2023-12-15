import { test, expect } from '@playwright/test';
import { authFile } from '../constants';

test.describe('Test page navigation un-authenticated', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test('should test all visible links when not authenticated', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'CrazyAuction CrazyAuction' }).click();
    await expect(page).toHaveURL('/');

    await page.getByRole('link', { name: 'Auctions' }).first().click();
    await expect(page).toHaveURL('/');

    await page.getByRole('link', { name: 'Leaderboard' }).click();
    await expect(
      page.getByRole('heading', { name: 'Login to CrazyAuction' }),
    ).toBeVisible();

    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveURL('/login');
    await expect(
      page.getByRole('heading', { name: 'Login to CrazyAuction' }),
    ).toBeVisible();

    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL('/register');
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
  });
});

test.describe('Test page navigation authenticated', () => {
  test.use({ storageState: authFile });

  test('should test all visible links when authenticated', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'CrazyAuction CrazyAuction' }).click();
    await expect(page).toHaveURL('/');
    await page.getByRole('link', { name: 'Auctions' }).click();
    await expect(page).toHaveURL('/');

    await page.getByRole('link', { name: 'Leaderboard' }).click();
    await expect(
      page.getByRole('cell', { name: 'User', exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Credits' })).toBeVisible();
    await expect(
      page.getByRole('cell', { name: 'Auctions', exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Winnings' })).toBeVisible();

    await page.getByTestId('user-menu-trigger').click();
    await page.getByRole('menuitem', { name: 'My Profile' }).click();
    await page.getByRole('heading', { name: 'playwright' }).click();
    await page.getByRole('heading', { name: 'Active Auctions' }).click();
    await page.getByRole('heading', { name: 'Wins' }).click();
  });
});

test.describe('Test mobile navigation', () => {
  test.use({ storageState: authFile });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    page.setViewportSize({ width: 320, height: 480 });
  });

  test('should show valid new auction link', async ({ page }) => {
    await expect(page.getByTestId('user-menu-trigger')).toBeVisible();
    await page.getByTestId('user-menu-trigger').click();
    await page.getByRole('menuitem', { name: 'New Auction' }).click();
    await expect(page.getByText('Info')).toBeVisible();
    await expect(page.getByText('Media')).toBeVisible();
    await expect(page.getByText('Time')).toBeVisible();
    await expect(page.getByText('Summary')).toBeVisible();
  });

  test('should show valid leaderboard link', async ({ page }) => {
    await expect(page.getByTestId('user-menu-trigger')).toBeVisible();

    await page.getByTestId('user-menu-trigger').click();
    await page.getByRole('menuitem', { name: 'Leaderboard' }).click();
    await expect(page).toHaveURL('/leaderboard');
  });

  test('should show valid profile link', async ({ page }) => {
    await expect(page.getByTestId('user-menu-trigger')).toBeVisible();

    await page.getByTestId('user-menu-trigger').click();
    await page.getByRole('menuitem', { name: 'My Profile' }).click();
    await expect(page).toHaveURL('/user/playwright');
    await expect(page.getByText('playwright')).toBeVisible();
  });

  test('should show valid logout link', async ({ page }) => {
    await expect(page.getByTestId('user-menu-trigger')).toBeVisible();

    await page.getByTestId('user-menu-trigger').click();
    await page.getByRole('menuitem', { name: 'Log out' }).click();

    await expect(page.getByTestId('search-filters')).toBeVisible();
  });
});
