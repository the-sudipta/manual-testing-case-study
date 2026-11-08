const { test, expect } = require('@playwright/test');
const { openHome, bookNowLinks, checkAvailability } = require('../support/booking-home');
const { captureEvidence, knownDefect, blockedBy } = require('../support/evidence');

test.afterEach(async ({ page }, testInfo) => captureEvidence(page, testInfo));

function futureDate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const pad = (n) => String(n).padStart(2, '0');
  return { ui: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`, iso: d.toISOString().slice(0, 10) };
}

test.describe('Booking platform - Availability and reservation', () => {
  test.beforeEach(async ({ page }) => openHome(page));

  test('TC-BK-010 should carry a valid date range to every Book now link', async ({ page }) => {
    const checkIn = futureDate(60);
    const checkOut = futureDate(62);
    const response = await checkAvailability(page, checkIn.ui, checkOut.ui);
    expect(response.status()).toBe(200);
    await expect(bookNowLinks(page).first()).toHaveAttribute('href', new RegExp(`checkin=${checkIn.iso}&checkout=${checkOut.iso}`));
  });

  test('TC-BK-009 should reject a check-out date before the check-in date', async ({ page }) => {
    knownDefect(test, 'BUG-017', 'reversed dates are accepted and every room is offered for booking');
    await checkAvailability(page, futureDate(65).ui, futureDate(60).ui);
    await expect(bookNowLinks(page)).toHaveCount(0);
  });

  test('TC-BK-006 should open the reservation page with the room details @smoke', async ({ page }) => {
    knownDefect(test, 'BUG-016', 'GET /api/room/{id} returns 500 and the page shows a spinner forever');
    await bookNowLinks(page).first().click();
    await expect(page.getByRole('button', { name: 'Reserve Now' })).toBeVisible({ timeout: 15_000 });
  });

  test('TC-BK-007 should reserve a room with valid guest details', async () => {
    blockedBy(test, 'BUG-016', 'reservation page never loads');
  });

  test('TC-BK-008 should show validation errors for empty guest details', async () => {
    blockedBy(test, 'BUG-016', 'reservation page never loads');
  });
});
