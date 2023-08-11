import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test('columns can be adjusted', async ({ page }) => {
  await expect(page.getByTestId('column-selector')).toBeVisible();
  await page.getByTestId('column-selector-input').fill('2');
  await expect(page.getByTestId('column-selector-input')).toHaveValue('2');
  await expect(page.getByTestId('pagination-numbers')).toHaveText('1 - 2 of  28');
  await page.getByTestId('column-selector-input').fill('6');
  await expect(page.getByTestId('column-selector-input')).toHaveValue('6');
  await expect(page.getByTestId('pagination-numbers')).toHaveText('1 - 12 of  28');
});
