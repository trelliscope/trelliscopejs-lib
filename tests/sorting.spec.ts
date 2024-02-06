import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('sort picker can be shown and hidden', async ({ page }) => {
  await expect(page.getByTestId('variable-picker')).not.toBeVisible();
  await page.getByTestId('sort-add-button').click();
  await expect(page.getByTestId('variable-picker')).toBeVisible();
  await page.getByTestId('sort-add-button').click();
  await expect(page.getByTestId('variable-picker')).not.toBeVisible();
});

test('sort can be selected and deselected', async ({ page }) => {
  await expect(page.getByTestId('variable-picker')).not.toBeVisible();
  await page.getByTestId('sort-add-button').click();
  await expect(page.getByTestId('variable-picker')).toBeVisible();
  await page.getByRole('option', { name: 'mean_gdp Mean GDP per capita' }).getByRole('checkbox').click();
  await expect(page.getByRole('option', { name: 'mean_gdp Mean GDP per capita' }).getByRole('checkbox')).toBeChecked();
  await page.getByRole('option', { name: 'mean_gdp Mean GDP per capita' }).getByRole('checkbox').click();
  await expect(page.getByRole('option', { name: 'mean_gdp Mean GDP per capita' }).getByRole('checkbox')).not.toBeChecked();
});

test('sort affects grid', async ({ page }) => {
  await expect(page.getByRole('row', { name: 'country Swaziland' }).locator('span')).toBeVisible();
  await page.getByRole('button', { name: 'mean_lexp' }).nth(4).click();
  await expect(page.getByRole('row', { name: 'country Swaziland' }).locator('span')).not.toBeVisible();
  await expect(page.getByRole('row', { name: 'country Sierra Leone' }).locator('span')).toBeVisible();
  await page.getByRole('button', { name: 'mean_lexp' }).nth(4).click();
  await expect(page.getByRole('row', { name: 'country Swaziland' }).locator('span')).toBeVisible();
  await expect(page.getByRole('row', { name: 'country Sierra Leone' }).locator('span')).not.toBeVisible();
});
