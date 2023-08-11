import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test('info modal is present and opens / closes', async ({ page }) => {
  await page.getByTestId('display-info-button').click();
  await expect(page.getByTestId('display-info-modal')).toBeVisible();
  await page.getByTestId('display-info-button-close').click();
  await expect(page.getByTestId('display-info-modal')).not.toBeVisible();
});

test('title is present', async ({ page }) => {
  await expect(page.getByTestId('selected-title')).toHaveText('gapminder');
});

test('display can be changed', async ({ page }) => {});

test('share modal functions', async ({ page }) => {
  await page.getByTestId('share-button').click();
  await expect(page.getByTestId('share-modal')).toBeVisible();
  await page.getByTestId('share-url').click();
  await page.getByTestId('copy-button').click();
  await expect(page.getByTestId('copy-button')).toHaveText('Copied!');
  await page.getByTestId('share-close').click();
  await expect(page.getByTestId('share-modal')).not.toBeVisible();
});

test('export input functions', async ({ page }) => {
  await page.getByTestId('export-button').click();
  await expect(page.getByTestId('export-input-dialog')).toBeVisible();
  await page.getByTestId('full-name-input').type('Joe');
  await page.getByTestId('email-input').type('dev@test.com');
  await page.getByTestId('job-title-input').type('Developer');
  await page.getByTestId('other-info-input').type('Other info');
  await expect(page.getByTestId('full-name-input')).toHaveValue('Joe');
  const localStorageItem = await page.evaluate(() => {
    return localStorage.getItem('__trelliscope_username');
  });
  await expect(localStorageItem).toBe('Joe');
  await page.getByTestId('export-input-clear').click();
  await expect(page.getByTestId('confirmation-modal')).toBeVisible();
  await page.getByTestId('confirmation-modal-cancel').click();
  await expect(page.getByTestId('confirmation-modal')).not.toBeVisible();
  await page.getByTestId('export-input-clear').click();
  await page.getByTestId('confirmation-modal-confirm').click();
  const localStorageItemAfterClear = await page.evaluate(() => {
    return localStorage.getItem('__trelliscope_username');
  });
  await expect(localStorageItemAfterClear).toBeNull();
  await expect(page.getByTestId('full-name-input')).toHaveValue('');
  await page.getByTestId('full-name-input').type('Joe');
  await page.getByTestId('export-input-next').click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('download-csv-button').click();
  const download = await downloadPromise;
  await expect(download.suggestedFilename()).toContain('.csv');
  await page.getByTestId('export-input-next').click();
  await page.getByTestId('export-input-back').click();
  await page.getByTestId('export-input-next').click();
  await page.getByTestId('export-input-compose-email').click();
  await page.getByTestId('export-input-close').click();
  await expect(page.getByTestId('export-input-dialog')).not.toBeVisible();
});

test('trelliscope title is present', async ({ page }) => {
  await expect(page.getByTestId('app-title')).toHaveText('Trelliscope');
});

test('trelliscope help modal functions', async ({ page }) => {
  await page.getByTestId('help-button').click();
  await expect(page.getByTestId('help-modal')).toBeVisible();
  await page.getByTestId('shortcuts-tab').click();
  const shortCutClassList = await page.getByTestId('shortcuts-tab').evaluate((el) => el.className);
  await expect(shortCutClassList).toContain('Mui-selected');
  await page.getByTestId('credits-tab').click();
  const creditsClassList = await page.getByTestId('credits-tab').evaluate((el) => el.className);
  await expect(creditsClassList).toContain('Mui-selected');
  await page.getByTestId('how-to-tab').click();
  const howToClassList = await page.getByTestId('how-to-tab').evaluate((el) => el.className);
  await expect(howToClassList).toContain('Mui-selected');
  await page.getByTestId('tour-toggle').click();
  const tourToggleLocalStorage = await page.evaluate(() => {
    return localStorage.getItem('trelliscope_tour');
  });
  await expect(tourToggleLocalStorage).toBe('skipped');
  await page.getByTestId('tour-toggle').click();
  const tourToggleLocalStorageAfterUnChecked = await page.evaluate(() => {
    return localStorage.getItem('trelliscope_tour');
  });
  await expect(tourToggleLocalStorageAfterUnChecked).toBeNull();

  await page.getByTestId('help-button-close').click();
  await expect(page.getByTestId('help-modal')).not.toBeVisible();
});

test('full screen functions', async ({ page }) => {
  await page.getByTestId('fullscreen-button').click();
});
