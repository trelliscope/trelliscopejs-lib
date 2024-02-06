import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await expect(page.getByTestId('panel-hover').first()).toBeVisible();
  await page.getByTestId('panel-hover').first().hover();
  await page.getByTestId('panel-expand-button').first().click();
});

test('panel dialog modal open and closes', async ({ page }) => {
  await expect(page.getByTestId('panel-dialog')).toBeVisible();
  await page.getByTestId('panel-dialog-close').click();
  await expect(page.getByTestId('panel-dialog')).not.toBeVisible();
});

test('panel dialog modal can paginate and panel picker is present and clickable', async ({ page }) => {
  await page.getByTestId('paginate-right').click();
  await page.getByTestId('paginate-left').click();
  await page.getByTestId('paginate-right').click();
  await page.getByTestId('variable-selector-button').click();
  await expect(page.getByTestId('variable-picker')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('pagination-numbers')).toHaveText('1 - 6 of  31142 total');
});

test('panel dialog image and tables are present', async ({ page }) => {
  await expect(page.getByTestId('panel-dialog-image')).toBeVisible();
  await expect(page.getByTestId('panel-dialog-table')).toBeVisible();
});
