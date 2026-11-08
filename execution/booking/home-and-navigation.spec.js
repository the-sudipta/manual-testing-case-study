const { test, expect } = require('@playwright/test');
const { BOOKING_URL, openHome, roomCards, bookNowLinks } = require('../support/booking-home');
const { captureEvidence, knownDefect } = require('../support/evidence');

test.afterEach(async ({ page }, testInfo) => captureEvidence(page, testInfo));

test.describe('Booking platform - Home page and navigation', () => {
  test.beforeEach(async ({ page }) => openHome(page));

  test('TC-BK-001 should show the B&B name, address, phone and email @smoke', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome to Shady Meadows B&B' })).toBeVisible();
    const contact = page.locator('#location');
    await expect(contact).toContainText('Newingtonfordburyshire');
    await expect(contact).toContainText('012345678901');
    await expect(contact).toContainText('fake@fakeemail.com');
  });

  test('TC-BK-002 should list rooms with type, price per night and Book now @smoke', async ({ page }) => {
    expect(await roomCards(page).count()).toBeGreaterThan(0);
    await expect(roomCards(page).first()).toContainText('per night');
    expect(await bookNowLinks(page).count()).toBe(await roomCards(page).count());
  });

  test('TC-BK-003 should scroll to the rooms section from the Rooms link', async ({ page }) => {
    await page.locator('nav').getByRole('link', { name: 'Rooms' }).click();
    await expect(page).toHaveURL(/#rooms$/);
    await expect(page.locator('#rooms')).toBeInViewport();
  });

  test('TC-BK-004 should scroll to an amenities section from the Amenities link', async ({ page }) => {
    knownDefect(test, 'BUG-018', 'Amenities link points to #amenities but no such section exists');
    await page.locator('nav').getByRole('link', { name: 'Amenities' }).click();
    await expect(page.locator('#amenities')).toHaveCount(1);
  });

  test('TC-BK-005 should link footer Quick Links to their sections', async ({ page }) => {
    knownDefect(test, 'BUG-019', 'all Quick Links in the footer have href="#"');
    const footerLinks = page.locator('footer').getByRole('link', { name: /^(Home|Rooms|Booking|Contact)$/ });
    await expect(footerLinks).toHaveCount(4);
    const hrefs = await footerLinks.evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    expect(hrefs.filter((href) => href === '#')).toEqual([]);
  });

  test('TC-BK-027 should open the cookie policy page', async ({ page }) => {
    await page.getByRole('link', { name: 'Cookie-Policy' }).click();
    await expect(page).toHaveURL(`${BOOKING_URL}/cookie`);
    await expect(page.getByText('Cookie Policy').first()).toBeVisible();
  });

  test('TC-BK-028 should open the privacy policy page', async ({ page }) => {
    await page.getByRole('link', { name: 'Privacy-Policy' }).click();
    await expect(page).toHaveURL(`${BOOKING_URL}/privacy`);
    await expect(page.getByText('Privacy Policy Notice').first()).toBeVisible();
  });
});
