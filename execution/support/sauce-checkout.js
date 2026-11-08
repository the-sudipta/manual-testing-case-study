// Checkout pages (information, overview, complete) of Sauce Demo.
const CUSTOMER = { first: 'Rahim', last: 'Uddin', zip: '1207' }; // fake test data

async function fillInformation(page, { first = '', last = '', zip = '' }) {
  if (first) await page.locator('[data-test="firstName"]').fill(first);
  if (last) await page.locator('[data-test="lastName"]').fill(last);
  if (zip) await page.locator('[data-test="postalCode"]').fill(zip);
  await page.locator('[data-test="continue"]').click();
}

const checkoutError = (page) => page.locator('[data-test="error"]');
const itemTotal = (page) => page.locator('[data-test="subtotal-label"]');
const taxLabel = (page) => page.locator('[data-test="tax-label"]');
const totalLabel = (page) => page.locator('[data-test="total-label"]');

async function finishOrder(page) {
  await page.locator('[data-test="finish"]').click();
}

const completeHeader = (page) => page.locator('[data-test="complete-header"]');

module.exports = { CUSTOMER, fillInformation, checkoutError, itemTotal, taxLabel, totalLabel, finishOrder, completeHeader };
