import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('pagination numbers are present', async ({ page }) => {
  await expect(page.getByTestId('pagination-numbers')).toHaveText('1 - 6 of  31142 total');
});

test('pagination numbers change when next button is clicked', async ({ page }) => {
  await page.getByTestId('pagination-next').click();
  await expect(page.getByTestId('pagination-numbers')).toHaveText('7 - 12 of  31142 total');
});

test('pagination numbers change when previous button is clicked', async ({ page }) => {
  await page.getByTestId('pagination-next').click();
  await page.getByTestId('pagination-previous').click();
  await expect(page.getByTestId('pagination-numbers')).toHaveText('1 - 6 of  31142 total');
});

test('pagination numbers change when last button is clicked', async ({ page }) => {
  await page.getByTestId('pagination-last').click();
  await expect(page.getByTestId('pagination-numbers')).toHaveText('31 of  31142 total');
});

test('pagination numbers change when first button is clicked', async ({ page }) => {
  await page.getByTestId('pagination-last').click();
  await page.getByTestId('pagination-first').click();
  await expect(page.getByTestId('pagination-numbers')).toHaveText('1 - 6 of  31142 total');
});

test('pagination functions in table view and all previoius steps pass again', async ({ page }) => {
  await page.getByTestId('layout-selector').click();
  await expect(page.getByTestId('grid-select')).toBeVisible();
  await expect(page.getByTestId('table-select')).toBeVisible();
  await page.getByTestId('table-select').click();
  await expect(page.getByTestId('pagination-numbers')).toHaveText('1 - 2 of  31142 total');
  await page.getByTestId('pagination-next').click();
  await expect(page.getByTestId('pagination-numbers')).toHaveText('3 - 4 of  31142 total');
  await page.getByTestId('pagination-previous').click();
  await page.getByTestId('pagination-next').click();
  await page.getByTestId('pagination-previous').click();
  await expect(page.getByTestId('pagination-numbers')).toHaveText('1 - 2 of  31142 total');
  await page.getByTestId('pagination-last').click();
  await expect(page.getByTestId('pagination-numbers')).toHaveText('31 of  31142 total');
  await page.getByTestId('pagination-first').click();
  await expect(page.getByTestId('pagination-numbers')).toHaveText('1 - 2 of  31142 total');
});
