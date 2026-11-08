const { test, expect } = require('@playwright/test');
const { loginAs } = require('../support/sauce-login');
const { captureEvidence, knownDefect } = require('../support/evidence');

test.afterEach(async ({ page }, testInfo) => captureEvidence(page, testInfo));

async function openFirstProduct(page) {
  const card = page.locator('.inventory_item').first();
  const listed = {
    name: await card.locator('[data-test="inventory-item-name"]').innerText(),
    price: await card.locator('[data-test="inventory-item-price"]').innerText(),
  };
  await card.locator('[data-test="inventory-item-name"]').click();
  await page.waitForURL('**/inventory-item.html?id=*');
  return listed;
}

test.describe('Sauce Demo - Product details', () => {
  test('TC-SD-021 should show the same name and price on the detail page', async ({ page }) => {
    await loginAs(page, 'standard_user');
    const listed = await openFirstProduct(page);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(listed.name);
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(listed.price);
  });

  test('TC-SD-022 should return to the product list with Back to products', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await openFirstProduct(page);
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-SD-023 should open the selected product for problem_user', async ({ page }) => {
    knownDefect(test, 'BUG-006', 'clicking a product opens a different product page');
    await loginAs(page, 'problem_user');
    const listed = await openFirstProduct(page);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(listed.name);
  });
});
