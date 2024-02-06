import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('layout selector is present with options', async ({ page }) => {
  await page.getByTestId('layout-selector').click();
  await expect(page.getByTestId('grid-select')).toBeVisible();
  await expect(page.getByTestId('table-select')).toBeVisible();
});

test('layout selector changes layout to grid and panels are visible', async ({ page }) => {
  await page.getByTestId('layout-selector').click();
  await page.getByTestId('table-select').click();
  await page.getByTestId('layout-selector').click();
  await page.getByTestId('grid-select').click();
  await expect(page.getByTestId('panel-content')).toBeVisible();
});

test('layout selector changes layout to table and rows are visible', async ({ page }) => {
  await page.getByTestId('layout-selector').click();
  await page.getByTestId('table-select').click();
  await expect(page.getByTestId('table-content')).toBeVisible();
});
