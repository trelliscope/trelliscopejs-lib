import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  // await page.getByTestId('filter-drawer-button').click();
});

test('filter drawer can be opened and closed', async ({ page }) => {
  await expect(page.getByTestId('filter-drawer-button-icon')).not.toBeVisible();
  await expect(page.getByTestId('filter-drawer')).toBeVisible();
  await page.getByTestId('filter-drawer-button').click();
  await expect(page.getByTestId('filter-drawer-button-icon')).toBeVisible();
});

test('filter controls function', async ({ page }) => {
  await page.getByTestId('filter-show-hide-button').click();
  await expect(page.getByTestId('variable-picker')).toBeVisible();
  await page.click('body');
  await page.getByTestId('filter-cat-input').type('cat');
  await page.getByTestId('filter-clear-all-button').click();
  await page.getByTestId('confirmation-modal-confirm').click();
  await expect(
    page.getByTestId('filter-drawer').locator('div').filter({ hasText: 'continentcontinent' }).nth(2),
  ).toBeVisible();
  await page.getByTestId('filter-remove-all-button').click();
  await page.getByTestId('confirmation-modal-confirm').click();
  await expect(
    page.getByTestId('filter-drawer').locator('div').filter({ hasText: 'continentcontinent' }).nth(2),
  ).not.toBeVisible();
});

test('filter item controls function', async ({ page, browserName }) => {
  if (browserName !== 'firefox') {
    await page.getByTestId('label-checkbox').first().click();
    await expect(page.getByTestId('label-checkbox').first()).toBeChecked();
    await expect(page.getByTestId('panel-content').getByText('mean_lexp').first()).toBeVisible();
    await page.getByTestId('label-checkbox').first().click();
    await expect(page.getByTestId('label-checkbox').first()).not.toBeChecked();
    await expect(page.getByTestId('panel-content').getByText('mean_lexp').first()).not.toBeVisible();
    await page.getByRole('button', { name: 'mean_lexp Mean life' }).getByLabel('close').click();
    await page.getByTestId('confirmation-modal-confirm').click();
    await page.getByTestId('filter-cat-input').type('cat');
    await page.getByTestId('clear-filter-button').click();
    await page.getByTestId('ellipsis-button').click();
    await expect(page.getByText('count ascending')).toBeVisible();
    await expect(page.getByText('count descending')).toBeVisible();
    await expect(page.getByText('label ascending')).toBeVisible();
    await expect(page.getByText('label descending')).toBeVisible();  
  }
});
