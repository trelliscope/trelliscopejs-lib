import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

// FIXME there seems to be a race condition here, the test struggles to click the panel picker, if you just do a .click() on
// testId it fails because there is 4 but other selectors dont seem to ever find the render,
// when debugging it appears that the dom hasnt loaded the panels

// test('panel dialog modal open and closes', async ({ page }) => {
//   const buttons = await page.getByRole('button', { name: 'Open panel dialog' });
//   //   await page.waitForTimeout(20000);
//   await buttons.first().click();

//   // the rest of your test...
// });

// test('panel dialog modal can paginate and panel picker is present and clickable', async ({ page }) => {
//   await page.getByTestId('panel-expand-button').click();
//   await expect(page.getByTestId('panel-dialog')).toBeVisible();
//   await page.getByTestId('paginate-right').click();
//   await page.getByTestId('paginate-left').click();
//   await page.getByTestId('variable-selector-button').click();
//   await expect(page.getByTestId('variable-picker')).toBeVisible();
// });
