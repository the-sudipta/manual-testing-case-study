// Login page of Sauce Demo.
const SAUCE_URL = 'https://www.saucedemo.com/';
const PASSWORD = 'secret_sauce'; // published on the Sauce Demo login page

async function openLogin(page) {
  await page.goto(SAUCE_URL);
}

async function submitLogin(page, username, password = PASSWORD) {
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
}

async function loginAs(page, username) {
  await openLogin(page);
  await submitLogin(page, username);
  await page.waitForURL('**/inventory.html');
}

function loginError(page) {
  return page.locator('[data-test="error"]');
}

module.exports = { SAUCE_URL, PASSWORD, openLogin, submitLogin, loginAs, loginError };
