// Cart page of Sauce Demo.
async function openCart(page) {
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.waitForURL('**/cart.html');
}

const cartItems = (page) => page.locator('[data-test="inventory-item"]');
const cartItemNames = (page) => page.locator('[data-test="inventory-item-name"]').allInnerTexts();

async function startCheckout(page) {
  await page.locator('[data-test="checkout"]').click();
}

module.exports = { openCart, cartItems, cartItemNames, startCheckout };
