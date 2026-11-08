# Exploratory Session 02 — Availability, reservation and admin login

| Field | Value |
|---|---|
| Charter | Explore **availability search, the reservation page and admin login** with **valid, reversed and past dates and wrong credentials** to discover **problems in the booking journey** |
| Application | https://automationintesting.online |
| Time box | 45 minutes |
| Date | 2026-11-08 |
| Tester | Sudipta Kumar Das |
| Tools | Microsoft Edge + DevTools (Network and Console tabs), curl |

## Session notes

- Check In / Check Out default to today and tomorrow (dd/mm/yyyy).
- Clicked "Book now" on room 1 → `/reservation/1?checkin=…&checkout=…`. The page shows only a spinner.
  Network: `GET /api/room/1` → **500 Internal Server Error**. Console: JSON parse error on the text
  "Internal Server Error". Waited more than 30 s — never loads.
- Tried rooms 2 and 3 and called the API directly with curl several times between 13:15 and 13:55 UTC:
  always 500. The room **list** (`GET /api/room`) still returns 200.
- Because the reservation page never loads, the reserve form could not be explored (TC-BK-007/008 blocked).
- Set Check In = +65 days and Check Out = +60 days, clicked Check Availability. No error; the request is sent
  with the reversed range and all rooms are offered with "Book now" links carrying the reversed dates.
- A valid future range (+60 to +62 days) correctly updates every Book now link.
- Admin page `/admin`: navbar shows "Front Page" and **"Logout"** before login.
- Wrong password → "Invalid credentials" and `POST /api/auth/login` → 401. Correct demo credentials →
  `/admin/rooms` with Rooms, Report, Branding, Messages.
- Logout from admin goes to the front page; opening `/admin` again asks for login (session ended — fine).

## Defects found

| ID | Title |
|---|---|
| BUG-016 | Reservation page never loads: GET /api/room/{id} returns 500 |
| BUG-017 | Check Availability accepts a check-out date before the check-in date |
| BUG-022 | Admin login page shows a "Logout" button before anyone has logged in |

## Questions for the team

1. Is the 500 on `/api/room/{id}` a known outage of the demo backend? If yes, when can we retest?
2. Should past dates be blocked in the availability search as well?

## Follow-up

Retest TC-BK-006 to TC-BK-008 once BUG-016 is fixed; then explore the reserve form (overlapping bookings,
past dates, length limits on names).
