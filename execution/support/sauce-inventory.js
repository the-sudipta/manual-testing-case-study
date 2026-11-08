// Inventory (products) page of Sauce Demo.
const CATALOGUE_PRICES = {
  'Sauce Labs Backpack': '$29.99',
  'Sauce Labs Bike Light': '$9.99',
  'Sauce Labs Bolt T-Shirt': '$15.99',
  'Sauce Labs Fleece Jacket': '$49.99',
  'Sauce Labs Onesie': '$7.99',
  'Test.allTheThings() T-Shirt (Red)': '$15.99',
};

const names = (page) => page.locator('[data-test="inventory-item-name"]').allInnerTexts();

async function prices(page) {
  const texts = await page.locator('[data-test="inventory-item-price"]').allInnerTexts();
  return texts.map((t) => Number(t.replace('$', '')));
}

const imageSources = (page) =>
  page.locator('.inventory_item_img img').evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src')));

async function sortBy(page, option) {
  await page.locator('[data-test="product-sort-container"]').selectOption(option);
}

async function addAllToCart(page) {
  const count = await page.locator('.inventory_item').count();
  for (let i = 0; i < count; i += 1) {
    await page.locator('.inventory_item').nth(i).locator('button').click();
  }
}

const cartBadge = (page) => page.locator('[data-test="shopping-cart-badge"]');
const itemButton = (page, slug) => page.locator(`[data-test$="${slug}"]`).first();

module.exports = { CATALOGUE_PRICES, names, prices, imageSources, sortBy, addAllToCart, cartBadge, itemButton };
