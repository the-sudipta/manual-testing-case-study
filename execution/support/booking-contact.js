// "Send Us a Message" contact form on the booking front page.
const VALID_MESSAGE = {
  name: 'Nusrat Jahan',
  email: 'nusrat.jahan@example.com',
  phone: '01712345678',
  subject: 'Room availability',
  description: 'Hello, is a double room available for two nights next month?',
};

async function fillContact(page, data) {
  const fields = { name: '#name', email: '#email', phone: '#phone', subject: '#subject', description: '#description' };
  for (const [key, selector] of Object.entries(fields)) {
    if (data[key] !== undefined) await page.locator(selector).fill(data[key]);
  }
}

async function submitContact(page, data) {
  await fillContact(page, data);
  const response = page.waitForResponse((r) => r.url().endsWith('/api/message') && r.request().method() === 'POST');
  await page.locator('#contact').getByRole('button', { name: 'Submit' }).click();
  return response;
}

const contactErrors = (page) => page.locator('#contact .alert-danger p, #contact .alert p');
const contactSection = (page) => page.locator('#contact');

module.exports = { VALID_MESSAGE, fillContact, submitContact, contactErrors, contactSection };
