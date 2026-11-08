# Exploratory Session 01 — Booking platform front page

| Field | Value |
|---|---|
| Charter | Explore the Shady Meadows front page **navigation and contact form** with **invalid, empty and boundary input** to discover **validation and navigation problems** |
| Application | https://automationintesting.online (restful-booker-platform v2.2) |
| Time box | 45 minutes |
| Date | 2026-11-08 |
| Tester | Sudipta Kumar Das |
| Tools | Microsoft Edge + DevTools (Network tab), curl for API checks |

## Session notes

- Navbar has six links: Rooms, Booking, Amenities, Location, Contact, Admin. Checked which anchor targets
  exist on the page: `#rooms`, `#booking`, `#location`, `#contact` exist; `#amenities` does **not**.
- Footer "Quick Links" (Home, Rooms, Booking, Contact) and the three social icons are all `href="#"`.
- Submitted the contact form empty. One red box shows 8 messages; Subject, Message and Phone each get a
  "may not be blank" **and** a length message. The order does not follow the form.
- Watched the request in DevTools: `POST /api/message` → `400` with the list of messages. Validation is done
  on the server; the form has no client-side validation.
- Tried the email field: `nusrat.example.com` → "must be a well-formed email address" (good).
- Tried boundaries from the error text: subject 5–100, message 20–2000, phone 11–21. 4/5 and 100/101 for
  subject, 19/20 for message, 10/11 for phone all behaved as described.
- Tried phone **content** instead of length: `abcdefghijk` (11 letters) is accepted → 200 and the thank-you
  message. Only the length is validated.
- Name with one character (`T`) is accepted — no minimum stated, so noted as a question, not a defect.
- Cookie-Policy and Privacy-Policy pages load and show their text.

## Defects found

| ID | Title |
|---|---|
| BUG-018 | Navbar "Amenities" link goes nowhere |
| BUG-019 | Footer Quick Links all point to "#" |
| BUG-020 | Contact form accepts a phone number made of letters |
| BUG-021 | Contact form shows eight duplicated error messages, not in form order |

## Questions for the team

1. Is there a minimum length for the guest name? A single character is accepted today.
2. Should the phone allow `+` and spaces (international format)? This decides the fix for BUG-020.
3. Is the Amenities section planned, or should the link be removed?

## Follow-up

Turned the boundary checks into TC-BK-012 … TC-BK-023 and the navigation checks into TC-BK-003 … TC-BK-005.
