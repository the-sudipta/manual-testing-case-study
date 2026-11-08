// Admin login page of the booking platform. Demo credentials are published by the site author.
const ADMIN = { username: 'admin', password: 'password' };

async function openAdmin(page, baseUrl) {
  await page.goto(`${baseUrl}/admin`);
  await page.locator('#username').waitFor();
}

async function adminLogin(page, username, password) {
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#doLogin').click();
}

module.exports = { ADMIN, openAdmin, adminLogin };
