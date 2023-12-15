import { expect, test as setup } from '@playwright/test';
import fs from 'fs';
import { authFile } from '../constants';

const isCI = process.env.CI === 'true';

const shouldSkipSetup = (filePath: string): [boolean, string] => {
  const shouldSkip = fs.existsSync(filePath) && !isCI;
  return [shouldSkip, `File ${filePath} already exists. Skipping setup.`];
};

setup('authenticate', async ({ page, context }) => {
  const [skip, reason] = shouldSkipSetup(authFile);
  if (skip) {
    console.log(reason);
    return expect(true).toBe(true);
  }
  await page.goto('/login');
  await page
    .getByPlaceholder('your-email@stud.noroff.no')
    .fill(process.env.PLAYWRIGHT_USERNAME!);
  await page
    .getByPlaceholder('Password')
    .fill(process.env.PLAYWRIGHT_PASSWORD!);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL('/');

  await expect(page.getByText('Sort by')).toBeVisible();
  const cookies = await context.cookies();
  expect(
    cookies.find((cookie) => cookie.name === 'next-auth.session-token'),
  ).toBeTruthy();

  await page.context().storageState({ path: authFile });
});
