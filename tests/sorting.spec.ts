import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test('sort picker can be shown and hidden', async ({ page }) => {
  await expect(page.getByTestId('variable-picker')).not.toBeVisible();
  await page.getByTestId('sort-add-button').click();
  await expect(page.getByTestId('variable-picker')).toBeVisible();
  await page.click('body');
  await expect(page.getByTestId('variable-picker')).not.toBeVisible();
});

test('sort can be selected and deselected', async ({ page }) => {
  await expect(page.getByTestId('variable-picker')).not.toBeVisible();
  await page.getByTestId('sort-add-button').click();
  await expect(page.getByTestId('variable-picker')).toBeVisible();
  await page.getByRole('option', { name: 'set_num Set number' }).getByRole('checkbox').click();
  await expect(page.getByRole('option', { name: 'set_num Set number' }).getByRole('checkbox')).toBeChecked();
  await page.getByRole('option', { name: 'set_num Set number' }).getByRole('checkbox').click();
  await expect(page.getByRole('option', { name: 'set_num Set number' }).getByRole('checkbox')).not.toBeChecked();
});

test('sort affects grid', async ({ page }) => {
  await expect(page.getByTestId('variable-picker')).not.toBeVisible();
  await expect(page.getByRole('row', { name: 'Set name World Map' }).locator('span')).toBeVisible();
  await page.getByRole('button', { name: 'n_parts' }).nth(1).click();
  await expect(page.getByRole('row', { name: 'Set name World Map' }).locator('span')).not.toBeVisible();
  await expect(page.getByRole('row', { name: 'Set name Town Mini-Figures' }).locator('span')).toBeVisible();
  await page.getByRole('button', { name: 'n_parts' }).nth(1).click();
  await expect(page.getByRole('row', { name: 'Set name World Map' }).locator('span')).toBeVisible();
  await expect(page.getByRole('row', { name: 'Set name Town Mini-Figures' }).locator('span')).not.toBeVisible();
});
