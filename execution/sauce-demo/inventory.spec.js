const { test, expect } = require('@playwright/test');
const { loginAs } = require('../support/sauce-login');
const inventory = require('../support/sauce-inventory');
const { captureEvidence, knownDefect } = require('../support/evidence');

test.afterEach(async ({ page }, testInfo) => captureEvidence(page, testInfo));

const sortedCopy = (list, compare) => [...list].sort(compare);
const byNameDesc = (a, b) => b.localeCompare(a);

test.describe('Sauce Demo - Product list and sorting', () => {
  test('TC-SD-012 should list six products with name, price, image and button @smoke', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(page.locator('.inventory_item button')).toHaveCount(6);
    expect(await inventory.names(page)).toHaveLength(6);
  });

  test('TC-SD-013 should show a different image for every product', async ({ page }) => {
    await loginAs(page, 'standard_user');
    expect(new Set(await inventory.imageSources(page)).size).toBe(6);
  });

  test('TC-SD-014 should show a different image for every product for problem_user', async ({ page }) => {
    knownDefect(test, 'BUG-002', 'all six products show the same dog image');
    await loginAs(page, 'problem_user');
    expect(new Set(await inventory.imageSources(page)).size).toBe(6);
  });

  test('TC-SD-015 should sort products by name Z to A', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await inventory.sortBy(page, 'za');
    const names = await inventory.names(page);
    expect(names).toEqual(sortedCopy(names, byNameDesc));
  });

  test('TC-SD-016 should sort products by price low to high', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await inventory.sortBy(page, 'lohi');
    const prices = await inventory.prices(page);
    expect(prices).toEqual(sortedCopy(prices, (a, b) => a - b));
  });

  test('TC-SD-017 should sort products by price high to low', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await inventory.sortBy(page, 'hilo');
    const prices = await inventory.prices(page);
    expect(prices).toEqual(sortedCopy(prices, (a, b) => b - a));
  });

  test('TC-SD-018 should sort products by name Z to A for problem_user', async ({ page }) => {
    knownDefect(test, 'BUG-003', 'sorting has no effect for problem_user');
    await loginAs(page, 'problem_user');
    await inventory.sortBy(page, 'za');
    const names = await inventory.names(page);
    expect(names).toEqual(sortedCopy(names, byNameDesc));
  });

  test('TC-SD-019 should sort products by name Z to A for error_user without errors', async ({ page }) => {
    knownDefect(test, 'BUG-008', 'sorting raises a "Sorting is broken!" alert for error_user');
    const alerts = [];
    page.on('dialog', async (dialog) => {
      alerts.push(dialog.message());
      await dialog.dismiss();
    });
    await loginAs(page, 'error_user');
    await inventory.sortBy(page, 'za');
    const names = await inventory.names(page);
    expect(alerts).toEqual([]);
    expect(names).toEqual(sortedCopy(names, byNameDesc));
  });

  test('TC-SD-020 should show catalogue prices for visual_user', async ({ page }) => {
    knownDefect(test, 'BUG-012', 'visual_user sees random prices that differ from the catalogue');
    await loginAs(page, 'visual_user');
    const names = await inventory.names(page);
    const shown = await page.locator('[data-test="inventory-item-price"]').allInnerTexts();
    expect(shown).toEqual(names.map((n) => inventory.CATALOGUE_PRICES[n]));
  });
});
