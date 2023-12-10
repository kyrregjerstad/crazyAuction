import { test, expect } from '@playwright/test';

// test.describe.configure({ mode: 'serial' });

test.describe('New Auction page', () => {
  test('should show the new auction form', async ({ page }) => {
    await page.goto('/auction?mode=create');

    await expect(
      page.getByRole('heading', { name: 'Create a New Auction' }),
    ).toBeVisible();
    await expect(page.getByText('Info')).toBeVisible();
    await expect(page.getByText('Media')).toBeVisible();
    await expect(page.getByText('Summary')).toBeVisible();
    await expect(page.getByPlaceholder('Title')).toBeVisible();
    await expect(page.getByPlaceholder('Description')).toBeVisible();
    await expect(page.getByPlaceholder('Tags')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
  });

  test('should show error messages when form is invalid', async ({ page }) => {
    await page.goto('/auction?mode=create');

    await page.getByRole('button', { name: 'Next' }).click();
    await expect(
      page.getByText('Title can not be shorter than 3 characters'),
    ).toBeVisible();
  });

  test('should successfully progress through all the pages', async ({
    page,
  }) => {
    await page.goto('/auction?mode=create');

    page.evaluate(() => {
      Date.now = () => new Date('2024-01-01T00:00:00.000Z').valueOf();
    });

    await page.getByPlaceholder('Title').fill('test title');
    await page.getByPlaceholder('Description').fill('test description');
    await page.getByPlaceholder('Tags').fill('tag1,tag2');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForURL('/auction?mode=create&step=media');

    await expect(
      page.getByText('Drag & drop files here, or click to select files'),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForURL('/auction?mode=create&step=time');

    await page.waitForURL('/auction?mode=create&step=time');

    await expect(page.getByTestId('calendar')).toBeVisible();

    // await page.getByText('10').click();
    // await page.getByRole('textbox').fill('23:00');
    // await page.getByRole('button', { name: 'Next' }).click();
    // await page.waitForURL('/auction?mode=create&step=summary');
  });
});
