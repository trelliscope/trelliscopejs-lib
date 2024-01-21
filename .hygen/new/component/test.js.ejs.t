---
to: "<%= test ? `tests/${name}.spec.ts` : null %>"
---
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});
