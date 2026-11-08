const { test, expect } = require('@playwright/test');
const { SAUCE_URL, openLogin, submitLogin, loginError } = require('../support/sauce-login');
const { captureEvidence, knownDefect } = require('../support/evidence');

test.afterEach(async ({ page }, testInfo) => captureEvidence(page, testInfo));

test.describe('Sauce Demo - Login', () => {
  test.beforeEach(async ({ page }) => openLogin(page));

  test('TC-SD-001 should log in standard_user with valid credentials @smoke', async ({ page }) => {
    await submitLogin(page, 'standard_user');
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('TC-SD-002 should show error for locked-out user', async ({ page }) => {
    await submitLogin(page, 'locked_out_user');
    await expect(loginError(page)).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('TC-SD-003 should show error for wrong password', async ({ page }) => {
    await submitLogin(page, 'standard_user', 'wrong_password');
    await expect(loginError(page)).toContainText('Username and password do not match');
  });

  test('TC-SD-004 should ask for username when username is empty', async ({ page }) => {
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(loginError(page)).toHaveText('Epic sadface: Username is required');
  });

  test('TC-SD-005 should ask for password when password is empty', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-button"]').click();
    await expect(loginError(page)).toHaveText('Epic sadface: Password is required');
  });

  test('TC-SD-006 should ask for username first when both fields are empty', async ({ page }) => {
    await page.locator('[data-test="login-button"]').click();
    await expect(loginError(page)).toHaveText('Epic sadface: Username is required');
  });

  test('TC-SD-007 should reject username with different letter case', async ({ page }) => {
    await submitLogin(page, 'Standard_User');
    await expect(loginError(page)).toContainText('Username and password do not match');
  });

  test('TC-SD-008 should clear the error when the close button is clicked', async ({ page }) => {
    await submitLogin(page, 'locked_out_user');
    await page.locator('[data-test="error-button"]').click();
    await expect(loginError(page)).toHaveCount(0);
  });

  test('TC-SD-009 should block direct access to inventory without login', async ({ page }) => {
    await page.goto(`${SAUCE_URL}inventory.html`);
    await expect(page).toHaveURL(SAUCE_URL);
    await expect(loginError(page)).toContainText("You can only access '/inventory.html' when you are logged in.");
  });

  test('TC-SD-010 should log in performance_glitch_user within 4 seconds', async ({ page }) => {
    knownDefect(test, 'BUG-013', 'login takes about 5 s longer than for other users');
    const started = Date.now();
    await submitLogin(page, 'performance_glitch_user');
    await page.locator('[data-test="inventory-list"]').waitFor({ timeout: 15_000 });
    expect(Date.now() - started).toBeLessThan(4_000);
  });

  test('TC-SD-011 should mask the password field', async ({ page }) => {
    await expect(page.locator('[data-test="password"]')).toHaveAttribute('type', 'password');
  });
});
