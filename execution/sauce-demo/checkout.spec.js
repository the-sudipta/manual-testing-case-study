const { test, expect } = require('@playwright/test');
const { loginAs } = require('../support/sauce-login');
const { openCart, startCheckout } = require('../support/sauce-cart');
const checkout = require('../support/sauce-checkout');
const { cartBadge } = require('../support/sauce-inventory');
const { captureEvidence, knownDefect } = require('../support/evidence');

test.afterEach(async ({ page }, testInfo) => captureEvidence(page, testInfo));

const { CUSTOMER } = checkout;
// Added in "Price (low to high)" order; the rounding error appears with this order.
const FIVE_ITEMS = ['sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt', 'test.allthethings()-t-shirt-(red)', 'sauce-labs-backpack', 'sauce-labs-fleece-jacket'];

async function goToInformation(page, user, slugs = ['sauce-labs-backpack']) {
  await loginAs(page, user);
  for (const slug of slugs) await page.locator(`[data-test="add-to-cart-${slug}"]`).click();
  await openCart(page);
  await startCheckout(page);
  await page.waitForURL('**/checkout-step-one.html');
}

test.describe('Sauce Demo - Checkout', () => {
  test('TC-SD-033 should continue to overview with all fields valid @smoke', async ({ page }) => {
    await goToInformation(page, 'standard_user');
    await checkout.fillInformation(page, CUSTOMER);
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('TC-SD-034 should require first name', async ({ page }) => {
    await goToInformation(page, 'standard_user');
    await checkout.fillInformation(page, { last: CUSTOMER.last, zip: CUSTOMER.zip });
    await expect(checkout.checkoutError(page)).toHaveText('Error: First Name is required');
  });

  test('TC-SD-035 should require last name', async ({ page }) => {
    await goToInformation(page, 'standard_user');
    await checkout.fillInformation(page, { first: CUSTOMER.first, zip: CUSTOMER.zip });
    await expect(checkout.checkoutError(page)).toHaveText('Error: Last Name is required');
  });

  test('TC-SD-036 should require postal code', async ({ page }) => {
    await goToInformation(page, 'standard_user');
    await checkout.fillInformation(page, { first: CUSTOMER.first, last: CUSTOMER.last });
    await expect(checkout.checkoutError(page)).toHaveText('Error: Postal Code is required');
  });

  test('TC-SD-037 should calculate item total, 8% tax and total for one item', async ({ page }) => {
    await goToInformation(page, 'standard_user');
    await checkout.fillInformation(page, CUSTOMER);
    await expect(checkout.itemTotal(page)).toHaveText('Item total: $29.99');
    await expect(checkout.taxLabel(page)).toHaveText('Tax: $2.40');
    await expect(checkout.totalLabel(page)).toHaveText('Total: $32.39');
  });

  test('TC-SD-038 should show the item total with two decimals for five items', async ({ page }) => {
    knownDefect(test, 'BUG-001', 'item total is shown as $121.94999999999999');
    await goToInformation(page, 'standard_user', FIVE_ITEMS);
    await checkout.fillInformation(page, CUSTOMER);
    await expect(checkout.itemTotal(page)).toHaveText('Item total: $121.95');
  });

  test('TC-SD-039 should complete the order and empty the cart @smoke', async ({ page }) => {
    await goToInformation(page, 'standard_user');
    await checkout.fillInformation(page, CUSTOMER);
    await checkout.finishOrder(page);
    await expect(checkout.completeHeader(page)).toHaveText('Thank you for your order!');
    await expect(cartBadge(page)).toHaveCount(0);
  });

  test('TC-SD-040 should cancel on overview and keep the cart', async ({ page }) => {
    await goToInformation(page, 'standard_user');
    await checkout.fillInformation(page, CUSTOMER);
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(cartBadge(page)).toHaveText('1');
  });

  test('TC-SD-041 should keep the typed last name for problem_user', async ({ page }) => {
    knownDefect(test, 'BUG-007', 'typing in Last Name changes First Name; checkout cannot continue');
    await goToInformation(page, 'problem_user');
    await checkout.fillInformation(page, CUSTOMER);
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('TC-SD-042 should complete the order for error_user', async ({ page }) => {
    knownDefect(test, 'BUG-009', 'Finish button does nothing for error_user');
    await goToInformation(page, 'error_user');
    await checkout.fillInformation(page, CUSTOMER);
    await checkout.finishOrder(page);
    await expect(checkout.completeHeader(page)).toHaveText('Thank you for your order!');
  });

  test('TC-SD-043 should not allow checkout with an empty cart', async ({ page }) => {
    knownDefect(test, 'BUG-014', 'empty cart can be checked out and a $0.00 order is completed');
    await loginAs(page, 'standard_user');
    await openCart(page);
    await startCheckout(page);
    await expect(page).toHaveURL(/cart\.html/);
  });

  test('TC-SD-051 should keep the typed last name for error_user', async ({ page }) => {
    knownDefect(test, 'BUG-010', 'Last Name field stays empty for error_user but Continue is still accepted');
    await goToInformation(page, 'error_user');
    await page.locator('[data-test="lastName"]').fill(CUSTOMER.last);
    await expect(page.locator('[data-test="lastName"]')).toHaveValue(CUSTOMER.last);
  });
});
