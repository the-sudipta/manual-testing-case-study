const { test, expect } = require('@playwright/test');
const { openLogin, loginAs } = require('../support/sauce-login');
const { CATALOGUE_PRICES } = require('../support/sauce-inventory');
const { captureEvidence } = require('../support/evidence');

test.afterEach(async ({ page }, testInfo) => captureEvidence(page, testInfo));

test.describe('Sauce Demo - Basic accessibility and layout', () => {
  test('TC-SD-048 should give every product image a meaningful alt text', async ({ page }) => {
    await loginAs(page, 'standard_user');
    const alts = await page.locator('.inventory_item_img img').evaluateAll((imgs) => imgs.map((i) => i.alt));
    expect(alts.sort()).toEqual(Object.keys(CATALOGUE_PRICES).sort());
  });

  test('TC-SD-049 should log in with the keyboard only', async ({ page }) => {
    await openLogin(page);
    await page.locator('[data-test="username"]').focus();
    await page.keyboard.type('standard_user');
    await page.keyboard.press('Tab');
    await page.keyboard.type('secret_sauce');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-SD-050 should fit the login page in a 390 px mobile screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openLogin(page);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(390);
    await expect(page.locator('[data-test="login-button"]')).toBeInViewport();
  });
});
