const { test, expect } = require('@playwright/test');
const { openHome } = require('../support/booking-home');
const { VALID_MESSAGE, submitContact, contactErrors, contactSection } = require('../support/booking-contact');
const { captureEvidence, knownDefect } = require('../support/evidence');

test.afterEach(async ({ page }, testInfo) => captureEvidence(page, testInfo));

const repeat = (length) => 'a'.repeat(length);
const EMPTY = { name: '', email: '', phone: '', subject: '', description: '' };

async function expectAccepted(page, overrides) {
  const response = await submitContact(page, { ...VALID_MESSAGE, ...overrides });
  expect(response.status()).toBe(200);
  await expect(contactSection(page)).toContainText('Thanks for getting in touch');
}

async function expectRejected(page, overrides, message) {
  const response = await submitContact(page, { ...VALID_MESSAGE, ...overrides });
  expect(response.status()).toBe(400);
  await expect(contactErrors(page)).toContainText([message]);
}

test.describe('Booking platform - Contact form', () => {
  test.beforeEach(async ({ page }) => openHome(page));

  test('TC-BK-011 should send a message with valid details @smoke', async ({ page }) => {
    await expectAccepted(page, {});
    await expect(contactSection(page)).toContainText(VALID_MESSAGE.name);
  });

  test('TC-BK-012 should show a required-field error for every empty field', async ({ page }) => {
    const response = await submitContact(page, EMPTY);
    expect(response.status()).toBe(400);
    for (const field of ['Name', 'Email', 'Phone', 'Subject', 'Message']) {
      await expect(contactErrors(page).filter({ hasText: `${field} may not be blank` })).toHaveCount(1);
    }
  });

  test('TC-BK-013 should reject an email without @ and domain', async ({ page }) => {
    await expectRejected(page, { email: 'nusrat.example.com' }, 'must be a well-formed email address');
  });

  test('TC-BK-014 should reject a 4-character subject', async ({ page }) => {
    await expectRejected(page, { subject: repeat(4) }, 'Subject must be between 5 and 100 characters.');
  });

  test('TC-BK-015 should accept a 5-character subject', async ({ page }) => {
    await expectAccepted(page, { subject: repeat(5) });
  });

  test('TC-BK-016 should reject a 101-character subject', async ({ page }) => {
    await expectRejected(page, { subject: repeat(101) }, 'Subject must be between 5 and 100 characters.');
  });

  test('TC-BK-017 should accept a 100-character subject', async ({ page }) => {
    await expectAccepted(page, { subject: repeat(100) });
  });

  test('TC-BK-018 should reject a 19-character message', async ({ page }) => {
    await expectRejected(page, { description: repeat(19) }, 'Message must be between 20 and 2000 characters.');
  });

  test('TC-BK-019 should accept a 20-character message', async ({ page }) => {
    await expectAccepted(page, { description: repeat(20) });
  });

  test('TC-BK-020 should reject a 10-digit phone number', async ({ page }) => {
    await expectRejected(page, { phone: '0171234567' }, 'Phone must be between 11 and 21 characters.');
  });

  test('TC-BK-021 should accept an 11-digit phone number', async ({ page }) => {
    await expectAccepted(page, { phone: '01712345678' });
  });

  test('TC-BK-022 should reject a phone number made of letters', async ({ page }) => {
    knownDefect(test, 'BUG-020', 'phone "abcdefghijk" is accepted; only the length is checked');
    const response = await submitContact(page, { ...VALID_MESSAGE, phone: 'abcdefghijk' });
    expect(response.status()).toBe(400);
  });

  test('TC-BK-023 should show one clear error per field for an empty form', async ({ page }) => {
    knownDefect(test, 'BUG-021', 'eight messages in random order; Subject, Message and Phone get two each');
    await submitContact(page, EMPTY);
    await expect(contactErrors(page)).toHaveCount(5);
  });
});
