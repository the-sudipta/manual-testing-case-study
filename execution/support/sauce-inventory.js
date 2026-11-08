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

// Clicks a button and, if it did not switch to "Remove" (click landed while the list was still rendering),
// clicks once more. A button that never works (a real defect) is left as it is.
async function clickAdd(button) {
  await button.click();
  const switched = await button.filter({ hasText: 'Remove' }).waitFor({ timeout: 1_500 }).then(() => true, () => false);
  if (!switched) await button.click();
}

async function addAllToCart(page) {
  await page.locator('[data-test="inventory-list"]').waitFor();
  const count = await page.locator('.inventory_item').count();
  for (let i = 0; i < count; i += 1) {
    await clickAdd(page.locator('.inventory_item').nth(i).locator('button'));
  }
}

const cartBadge = (page) => page.locator('[data-test="shopping-cart-badge"]');
const itemButton = (page, slug) => page.locator(`[data-test$="${slug}"]`).first();

module.exports = { CATALOGUE_PRICES, names, prices, imageSources, sortBy, addAllToCart, cartBadge, itemButton };
