# Test Scenarios

High-level scenarios derived from the requirements in the traceability matrix. Each scenario is broken down
into detailed test cases in the workbooks under `test-cases/`.

## AUT-1 — Sauce Demo (e-commerce)

| Scenario ID | Requirement | Scenario | Test cases |
|---|---|---|---|
| TS-SD-01 | SD-R01 | Verify login with valid and invalid credentials for every demo user type | TC-SD-001 … TC-SD-011 |
| TS-SD-02 | SD-R02 | Verify the product list shows correct names, prices and images | TC-SD-012 … TC-SD-014, TC-SD-020 |
| TS-SD-03 | SD-R03 | Verify sorting by name and price in both directions | TC-SD-015 … TC-SD-019 |
| TS-SD-04 | SD-R04 | Verify the product detail page matches the selected product | TC-SD-021 … TC-SD-023 |
| TS-SD-05 | SD-R05 | Verify adding and removing items and the cart badge in every state | TC-SD-024 … TC-SD-032, TC-SD-052 |
| TS-SD-06 | SD-R06 | Verify checkout information validation (first name, last name, postal code) | TC-SD-033 … TC-SD-036, TC-SD-041, TC-SD-051 |
| TS-SD-07 | SD-R07 | Verify order overview totals, tax and number formatting | TC-SD-037, TC-SD-038 |
| TS-SD-08 | SD-R08 | Verify order completion, cancel and empty-cart behaviour | TC-SD-039, TC-SD-040, TC-SD-042, TC-SD-043 |
| TS-SD-09 | SD-R09 | Verify menu actions: logout, reset app state, about; footer links | TC-SD-044 … TC-SD-047 |
| TS-SD-10 | SD-R10 | Verify basic accessibility and responsive layout | TC-SD-048 … TC-SD-050 |

## AUT-2 — Restful Booker Platform (Shady Meadows B&B)

| Scenario ID | Requirement | Scenario | Test cases |
|---|---|---|---|
| TS-BK-01 | BK-R01 | Verify the home page shows branding, rooms and contact details | TC-BK-001, TC-BK-002 |
| TS-BK-02 | BK-R02 | Verify navigation links (navbar and footer) reach the right section | TC-BK-003 … TC-BK-005 |
| TS-BK-03 | BK-R03 | Verify a guest can check availability for a valid date range and is stopped for an invalid range | TC-BK-009, TC-BK-010 |
| TS-BK-04 | BK-R04 | Verify a guest can open a room and reserve it | TC-BK-006 … TC-BK-008 |
| TS-BK-05 | BK-R05 | Verify the contact form accepts valid input and rejects invalid input with clear messages | TC-BK-011 … TC-BK-023 |
| TS-BK-06 | BK-R06 | Verify admin login, invalid login and logout | TC-BK-024 … TC-BK-026, TC-BK-029 |
| TS-BK-07 | BK-R07 | Verify cookie and privacy policy pages are reachable | TC-BK-027, TC-BK-028 |
