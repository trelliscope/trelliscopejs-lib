import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('labels modal open and closes', async ({ page }) => {
  await expect(page.getByTestId('variable-picker')).not.toBeVisible();
  await page.getByTestId('labels-button').click();
  await expect(page.getByTestId('variable-picker')).toBeVisible();
  await page.click('body');
  await expect(page.getByTestId('variable-picker')).not.toBeVisible();
});

test('label can be selected and deselected', async ({ page }) => {
  await expect(page.getByTestId('variable-picker')).not.toBeVisible();
  await expect(page.getByRole('row', { name: 'Set number 31203-1' }).locator('span')).not.toBeVisible();
  await page.getByTestId('labels-button').click();
  await expect(page.getByTestId('variable-picker')).toBeVisible();
  await page.getByRole('option', { name: 'set_num Set number' }).getByRole('checkbox').click();
  await page.click('body');
  await expect(page.getByRole('row', { name: 'Set number 31203-1' }).locator('span')).toBeVisible();
  await page.getByTestId('labels-button').click();
  await expect(page.getByTestId('variable-picker')).toBeVisible();
  await page.getByRole('option', { name: 'set_num Set number' }).getByRole('checkbox').click();
  await page.click('body');
  await expect(page.getByRole('row', { name: 'Set number 31203-1' }).locator('span')).not.toBeVisible();
});
