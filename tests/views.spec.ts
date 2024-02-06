import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('views modal open and closes', async ({ page }) => {
  await page.getByTestId('views-button').click();
  await expect(page.getByTestId('views-menu')).toBeVisible();
  await page.click('body');
  await expect(page.getByTestId('views-menu')).not.toBeVisible();
});

test('views can be added, clicked, and deleted', async ({ page }) => {
  await page.getByTestId('views-button').click();
  await expect(page.getByTestId('views-menu')).toBeVisible();
  await page.getByTestId('add-view-button').click();
  await expect(page.getByTestId('views-modal')).toBeVisible();
  await page.getByTestId('view-name-input').click();
  await page.getByTestId('view-name-input').type('test view');
  await page.getByTestId('view-description-input').click();
  await page.getByTestId('view-description-input').type('test description');
  await page.getByTestId('view-save-button').click();
  const localStorageItem = await page.evaluate(() => {
    return localStorage.getItem('_:_Life expectancy_:_trelliscope_views_:_test view');
  });
  const jsonObject = JSON.parse(localStorageItem as string);
  await expect(jsonObject.name).toBe('test view');
  await expect(jsonObject.description).toBe('test description');
  await page.click('body');
  await expect(page.getByTestId('views-modal')).not.toBeVisible();
  await page.locator('h6:has-text("test view")').click();
  await expect(page.getByTestId('views-menu')).not.toBeVisible();
  await page.getByTestId('views-button').click();
  await expect(page.getByTestId('views-menu')).toBeVisible();
  await expect(page.locator('h6:has-text("test view")')).toBeVisible();
  await page.getByTestId('delete-view-button').click();
  await expect(page.locator('h6:has-text("test view")')).not.toBeVisible();
});

test('views can be exported', async ({ page }) => {
  await page.getByTestId('views-button').click();
  await page.getByTestId('export-views-button').click();
  await expect(page.getByTestId('export-views-modal')).toBeVisible();
  await page.getByTestId('export-name-input').click();
  await page.getByTestId('export-name-input').type('test export');
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('export-download-button').click();
  const download = await downloadPromise;
  await expect(download.suggestedFilename()).toContain('.json');
});

test('views import modal opens and closes', async ({ page }) => {
  await page.getByTestId('views-button').click();
  await page.getByTestId('import-views-button').click();
  await expect(page.getByTestId('import-views-modal')).toBeVisible();
  await page.getByTestId('views-import-cancel').click();
  await expect(page.getByTestId('import-views-modal')).not.toBeVisible();
});
