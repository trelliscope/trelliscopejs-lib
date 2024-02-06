import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await page.getByTestId('layout-selector').click();
  await page.getByTestId('table-select').click();
});

test('table is present and columns button transforms into table columns settings', async ({ page }) => {
  await expect(page.getByTestId('data-table')).toBeVisible();
  await expect(page.getByTestId('columns-table')).toBeVisible();
  await page.getByLabel('Show/Hide columns').click();
  await expect(page.getByRole('button', { name: 'Hide all' })).toBeVisible();
});

test('table column global controls function', async ({ page }) => {
  await expect(page.getByTestId('data-table')).toBeVisible();
  await expect(page.getByTestId('columns-table')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'lexp_time Move' }).locator('div').first()).toBeVisible();
  await page.getByLabel('Show/Hide columns').click();
  await page.getByRole('button', { name: 'Hide all' }).click();
  await page.click('body');
  await expect(page.getByRole('columnheader', { name: 'lexp_time Move' }).locator('div').first()).not.toBeVisible();
  await page.getByLabel('Show/Hide columns').click();
  await page.getByRole('button', { name: 'Show all' }).click();
  await page.click('body');
  await expect(page.getByRole('columnheader', { name: 'lexp_time Move' }).locator('div').first()).toBeVisible();
  await page.getByLabel('Show/Hide columns').click();
  await page.getByRole('button', { name: 'Unpin all' }).click();
  await expect(
    page.getByRole('menuitem', { name: 'Move Unpin Toggle visibility lexp_time' }).getByLabel('Unpin'),
  ).not.toBeVisible();
});

test('columns are able to be hidden and shown on the table', async ({ page }) => {
  await expect(page.getByTestId('data-table')).toBeVisible();
  await expect(page.getByTestId('columns-table')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'lexp_time Move' }).locator('div').first()).toBeVisible();
  await page.getByLabel('Show/Hide columns').click();
  await expect(page.getByRole('button', { name: 'Hide all' })).toBeVisible();
  await page.getByRole('menuitem', { name: 'Move Unpin Toggle visibility lexp_time' }).click();
  await page.click('body');
  await expect(page.getByRole('columnheader', { name: 'lexp_time Move' }).locator('div').first()).not.toBeVisible();
  await page.getByLabel('Show/Hide columns').click();
  await expect(page.getByRole('button', { name: 'Hide all' })).toBeVisible();
  await page.getByRole('menuitem', { name: 'Move Unpin Toggle visibility lexp_time' }).click();
  await page.click('body');
  await expect(page.getByRole('columnheader', { name: 'lexp_time Move' }).locator('div').first()).toBeVisible();
});

test('columns are able to be pinned left and right and unpinned on the table', async ({ page }) => {
  await expect(page.getByTestId('data-table')).toBeVisible();
  await expect(page.getByTestId('columns-table')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'lexp_time Move' }).locator('div').first()).toBeVisible();
  await page.getByLabel('Show/Hide columns').click();
  await expect(page.getByRole('button', { name: 'Hide all' })).toBeVisible();
  await page
    .getByRole('menuitem', { name: 'Move Pin to left Pin to right Toggle visibility country' })
    .getByLabel('Pin to left')
    .click();
  await page.click('body');
  await page.getByLabel('Show/Hide columns').click();
  await expect(page.getByRole('button', { name: 'Hide all' })).toBeVisible();
  await page.getByRole('menuitem', { name: 'Move Unpin Toggle visibility country' }).getByLabel('Unpin').click();
  await page.click('body');
  await page.getByLabel('Show/Hide columns').click();
  await expect(page.getByRole('button', { name: 'Hide all' })).toBeVisible();
  await page
    .getByRole('menuitem', { name: 'Move Pin to left Pin to right Toggle visibility country' })
    .getByLabel('Pin to right')
    .click();
  await page.click('body');
});
