const { test, expect } = require('@playwright/test');
const { BOOKING_URL } = require('../support/booking-home');
const { ADMIN, openAdmin, adminLogin } = require('../support/booking-admin');
const { captureEvidence, knownDefect } = require('../support/evidence');

test.afterEach(async ({ page }, testInfo) => captureEvidence(page, testInfo));

test.describe('Booking platform - Admin login', () => {
  test.beforeEach(async ({ page }) => openAdmin(page, BOOKING_URL));

  test('TC-BK-024 should log in the admin with valid credentials @smoke', async ({ page }) => {
    await adminLogin(page, ADMIN.username, ADMIN.password);
    await expect(page).toHaveURL(/\/admin\/rooms/);
    await expect(page.getByRole('link', { name: 'Report' })).toBeVisible();
  });

  test('TC-BK-025 should show an error for a wrong password', async ({ page }) => {
    await adminLogin(page, ADMIN.username, 'wrong-password');
    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test('TC-BK-026 should log out and ask for login again on the admin page', async ({ page }) => {
    await adminLogin(page, ADMIN.username, ADMIN.password);
    await expect(page).toHaveURL(/\/admin\/rooms/);
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(`${BOOKING_URL}/`);
    await openAdmin(page, BOOKING_URL);
    await expect(page.locator('#username')).toBeVisible();
  });

  test('TC-BK-029 should not show Logout before the admin has logged in', async ({ page }) => {
    knownDefect(test, 'BUG-022', 'Logout button is visible on the login page');
    await expect(page.getByRole('button', { name: 'Logout' })).toHaveCount(0);
  });
});
