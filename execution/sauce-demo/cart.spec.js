const { test, expect } = require('@playwright/test');
const { loginAs } = require('../support/sauce-login');
const inventory = require('../support/sauce-inventory');
const { openCart, cartItems, cartItemNames } = require('../support/sauce-cart');
const { logout } = require('../support/sauce-menu');
const { captureEvidence, knownDefect } = require('../support/evidence');

test.afterEach(async ({ page }, testInfo) => captureEvidence(page, testInfo));

const BACKPACK = 'sauce-labs-backpack';
const BIKE_LIGHT = 'sauce-labs-bike-light';

test.describe('Sauce Demo - Cart', () => {
  test('TC-SD-024 should add one item and show badge 1 @smoke', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator(`[data-test="add-to-cart-${BACKPACK}"]`).click();
    await expect(inventory.cartBadge(page)).toHaveText('1');
    await expect(page.locator(`[data-test="remove-${BACKPACK}"]`)).toBeVisible();
  });

  test('TC-SD-025 should remove the item from the product list and hide the badge', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator(`[data-test="add-to-cart-${BACKPACK}"]`).click();
    await page.locator(`[data-test="remove-${BACKPACK}"]`).click();
    await expect(inventory.cartBadge(page)).toHaveCount(0);
  });

  test('TC-SD-026 should add all six items and show badge 6', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await inventory.addAllToCart(page);
    await expect(inventory.cartBadge(page)).toHaveText('6');
  });

  test('TC-SD-027 should list added items with quantity 1 in the cart', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator(`[data-test="add-to-cart-${BACKPACK}"]`).click();
    await page.locator(`[data-test="add-to-cart-${BIKE_LIGHT}"]`).click();
    await openCart(page);
    expect(await cartItemNames(page)).toEqual(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText(['1', '1']);
  });

  test('TC-SD-028 should remove an item on the cart page', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator(`[data-test="add-to-cart-${BACKPACK}"]`).click();
    await openCart(page);
    await page.locator(`[data-test="remove-${BACKPACK}"]`).click();
    await expect(cartItems(page)).toHaveCount(0);
  });

  test('TC-SD-029 should go back to products with Continue Shopping', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await openCart(page);
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-SD-030 should keep the cart after logout and login again', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator(`[data-test="add-to-cart-${BIKE_LIGHT}"]`).click();
    await logout(page);
    await loginAs(page, 'standard_user');
    await expect(inventory.cartBadge(page)).toHaveText('1');
  });

  test('TC-SD-031 should add all six items for problem_user', async ({ page }) => {
    knownDefect(test, 'BUG-004', 'only three of the six Add to cart buttons work for problem_user');
    await loginAs(page, 'problem_user');
    await inventory.addAllToCart(page);
    await expect(inventory.cartBadge(page)).toHaveText('6');
  });

  test('TC-SD-032 should remove an item from the product list for problem_user', async ({ page }) => {
    knownDefect(test, 'BUG-005', 'Remove button on the product list does nothing for problem_user');
    await loginAs(page, 'problem_user');
    await page.locator(`[data-test="add-to-cart-${BACKPACK}"]`).click();
    await page.locator(`[data-test="remove-${BACKPACK}"]`).click();
    await expect(inventory.cartBadge(page)).toHaveCount(0);
  });

  test('TC-SD-052 should add all six items for error_user', async ({ page }) => {
    knownDefect(test, 'BUG-011', 'only three of the six Add to cart buttons work for error_user');
    await loginAs(page, 'error_user');
    await inventory.addAllToCart(page);
    await expect(inventory.cartBadge(page)).toHaveText('6');
  });
});
