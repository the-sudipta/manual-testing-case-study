// Front page of the Restful Booker Platform (Shady Meadows B&B).
const BOOKING_URL = 'https://automationintesting.online';

async function openHome(page) {
  await page.goto(BOOKING_URL);
  await page.locator('#rooms .room-card, #rooms .card').first().waitFor();
}

const roomCards = (page) => page.locator('#rooms .room-card, #rooms .card');
const bookNowLinks = (page) => page.locator('a[href^="/reservation/"]');

async function setDates(page, checkIn, checkOut) {
  const inputs = page.locator('#booking input');
  await inputs.nth(0).fill(checkIn);
  await inputs.nth(0).press('Escape');
  await inputs.nth(1).fill(checkOut);
  await inputs.nth(1).press('Escape');
}

async function checkAvailability(page, checkIn, checkOut) {
  await setDates(page, checkIn, checkOut);
  const response = page.waitForResponse((r) => r.url().includes('/api/room?checkin='));
  await page.getByRole('button', { name: 'Check Availability' }).click();
  return response;
}

module.exports = { BOOKING_URL, openHome, roomCards, bookNowLinks, setDates, checkAvailability };
