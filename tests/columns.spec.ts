import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('columns can be adjusted', async ({ page }) => {
  await expect(page.getByTestId('column-selector-input')).toBeVisible();
  await page.getByTestId('column-selector-input').fill('3');
  await expect(page.getByTestId('column-selector-input')).toHaveValue('3');
  await expect(page.getByTestId('pagination-numbers')).toHaveText('1 - 6 of  31142 total');
  await page.getByTestId('column-selector-input').fill('6');
  await expect(page.getByTestId('column-selector-input')).toHaveValue('6');
  await expect(page.getByTestId('pagination-numbers')).toHaveText('1 - 24 of  31142 total');
});
