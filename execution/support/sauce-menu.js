// Burger menu of Sauce Demo.
async function openMenu(page) {
  await page.locator('#react-burger-menu-btn').click();
}

async function chooseMenuItem(page, id) {
  await openMenu(page);
  await page.locator(`#${id}`).click();
}

const logout = (page) => chooseMenuItem(page, 'logout_sidebar_link');
const resetAppState = (page) => chooseMenuItem(page, 'reset_sidebar_link');

module.exports = { openMenu, chooseMenuItem, logout, resetAppState };
