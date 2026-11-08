# Exploratory Session 03 — Sauce Demo cart, checkout and demo users

| Field | Value |
|---|---|
| Charter | Explore **cart and checkout** with **every demo user, different cart sizes and menu actions** to discover **wrong totals and state problems** |
| Application | https://www.saucedemo.com |
| Time box | 45 minutes |
| Date | 2026-11-08 |
| Tester | Sudipta Kumar Das |
| Tools | Microsoft Edge + DevTools, a stopwatch script for login timing |

## Session notes

- Logged in with each user from the login page list. `locked_out_user` gets the locked-out message.
- `standard_user`: sorted "Price (low to high)", added all six, removed the Onesie, went to checkout.
  Overview showed **"Item total: $121.94999999999999"** while Tax ($9.76) and Total ($131.71) are rounded.
  Same five items added in A–Z order give $121.95 — the result depends on the order of addition.
- Empty cart: Checkout is still enabled → overview shows "Item total: $0" (no decimals) and Finish says
  "Thank you for your order!".
- Added Backpack, then menu → Reset App State: badge disappears but the Backpack button still says "Remove".
  After a reload it shows "Add to cart".
- Cart is kept after logout and login (stored in the browser) — fine for a demo, noted.
- `problem_user`: same dog image everywhere, sort does nothing, 3 of 6 Add to cart buttons work, Remove on
  the list does nothing, Backpack name opens the Fleece Jacket page, Last Name typing goes into First Name.
- `error_user`: sorting shows an alert "Sorting is broken!", 3 of 6 Add to cart buttons work, Last Name stays
  empty but Continue is accepted, Finish does nothing.
- `visual_user`: prices on the list are random and change on reload; the cart uses the real price.
- `performance_glitch_user`: login takes about 5.3 s vs under 1 s for `standard_user`.

## Defects found

| ID | Title |
|---|---|
| BUG-001 | Item total shows an unrounded value $121.94999999999999 |
| BUG-014 | Checkout is allowed with an empty cart and completes a $0.00 order |
| BUG-015 | Reset App State clears the badge but product buttons still show "Remove" |

The user-specific defects (BUG-002 – BUG-013) were confirmed in this session and then covered by scripted cases.

## Questions for the team

1. Should the cart survive logout on a shared computer? (Privacy question, not reported as a defect.)
2. Is there a maximum quantity per item? The UI only allows quantity 1.

## Follow-up

Added TC-SD-038, TC-SD-043, TC-SD-045 and the per-user cases TC-SD-010 … TC-SD-052 to the workbook.
