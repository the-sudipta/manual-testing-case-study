const { test, expect } = require('@playwright/test');
const { SAUCE_URL, loginAs, loginError } = require('../support/sauce-login');
const { cartBadge } = require('../support/sauce-inventory');
const { openMenu, logout, resetAppState } = require('../support/sauce-menu');
const { captureEvidence, knownDefect } = require('../support/evidence');

test.afterEach(async ({ page }, testInfo) => captureEvidence(page, testInfo));

test.describe('Sauce Demo - Menu and footer', () => {
  test('TC-SD-044 should log out and block the Back button @smoke', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await logout(page);
    await expect(page).toHaveURL(SAUCE_URL);
    await page.goBack();
    await expect(loginError(page)).toContainText('when you are logged in');
  });

  test('TC-SD-045 should reset cart badge and buttons with Reset App State', async ({ page }) => {
    knownDefect(test, 'BUG-015', 'badge is cleared but the product still shows "Remove"');
    await loginAs(page, 'standard_user');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await resetAppState(page);
    await expect(cartBadge(page)).toHaveCount(0);
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
  });

  test('TC-SD-046 should point About to the Sauce Labs website', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await openMenu(page);
    await expect(page.locator('#about_sidebar_link')).toHaveAttribute('href', 'https://saucelabs.com/');
  });

  test('TC-SD-047 should open footer social links in a new tab', async ({ page }) => {
    await loginAs(page, 'standard_user');
    const links = page.locator('footer a');
    await expect(links).toHaveCount(3);
    for (const href of ['x.com/saucelabs', 'facebook.com/saucelabs', 'linkedin.com/company/sauce-labs']) {
      const link = page.locator(`footer a[href*="${href}"]`);
      await expect(link).toHaveAttribute('target', '_blank');
    }
  });
});
