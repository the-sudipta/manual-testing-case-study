# Test Plan — Manual QA Case Study

| Field | Value |
|---|---|
| Document ID | TP-MTCS-001 |
| Version | 1.0 |
| Author | Sudipta Kumar Das (QA) |
| Status | Approved for execution |
| Applications | Sauce Demo (e-commerce), Restful Booker Platform "Shady Meadows B&B" (booking) |

This plan follows the structure of IEEE 829 and the ideas of ISO/IEC/IEEE 29119-3, trimmed to what a small
team actually needs. Both applications are **public practice applications** that invite testers to practise on
them; no real customer data is used.

---

## 1. Introduction

The goal of this case study is to run a complete manual QA cycle on two web applications the way a junior QA
engineer works in a real team: understand the requirements, plan, design test cases with formal techniques,
execute them, report defects with evidence, and close the cycle with a summary report.

## 2. Test items

| ID | Application | URL | Build / version under test |
|---|---|---|---|
| AUT-1 | Sauce Demo | https://www.saucedemo.com | Public build available during the test window |
| AUT-2 | Restful Booker Platform (Shady Meadows B&B) | https://automationintesting.online | Public build available during the test window |

Because both are hosted demo sites, the exact build number is not exposed. The test window and browser
versions are recorded in the summary report so that results can be reproduced.

## 3. Objectives

1. Verify that the core user journeys work: log in → browse → add to cart → checkout (AUT-1) and
   view rooms → check availability → book a room → send a contact message → admin login (AUT-2).
2. Verify input validation and error handling for every form (login, checkout, contact, booking, admin login).
3. Find and report real defects with clear, reproducible steps and evidence.
4. Produce a requirements traceability matrix so every requirement is covered by at least one case.
5. Give a clear release recommendation based on the results.

## 4. Scope

### 4.1 In scope

| Area | AUT-1 Sauce Demo | AUT-2 Booking platform |
|---|---|---|
| Authentication | Login for all six demo users, error messages, logout | Admin login (valid / invalid), logout |
| Catalogue | Product list, product details, images, prices, sorting | Room list, room details, prices, features |
| Cart / Booking | Add / remove items, cart badge, cart page, continue shopping | Date selection, availability, reservation form |
| Checkout | Customer info form, overview, totals and tax, finish, cancel | Booking confirmation, invalid / overlapping dates |
| Forms | Checkout information validation | Contact form validation (all fields, lengths, email format) |
| Navigation | Burger menu, Reset App State, footer links | Navbar anchors, Admin link, footer links |
| UI | Layout, alignment, images, text | Layout, branding, map / location section |
| Basic accessibility | Keyboard use, labels, alt text, contrast spot checks | Same |
| Cross-browser | Chromium, Firefox, WebKit (smoke subset) | Chromium, Firefox (smoke subset) |

### 4.2 Out of scope

- Performance, load and security testing (public practice sites must not be load-tested).
- Payment processing (Sauce Demo has no real payment; the booking site has no payment step).
- Email delivery of messages and bookings.
- Admin panel features beyond login/logout and reading messages (the shared demo data resets often).
- Mobile native apps; only responsive layout at one mobile width is spot-checked.

## 5. Approach

| Test type | How it is done |
|---|---|
| Functional | Scripted test cases written from the observed behaviour and the visible requirements (see `test-scenarios.md`). |
| Negative | Empty, too short, too long and wrongly formatted inputs; invalid credentials; invalid date ranges. |
| UI | Visual checks of layout, text, images and alignment, compared with the standard user / expected design. |
| Cross-browser | A smoke subset run in Chromium, Firefox and WebKit. |
| Basic accessibility | Keyboard-only navigation, form labels, image alt text, focus visibility. |
| Exploratory | Three time-boxed sessions (charter-based) to find issues that scripted cases miss. |

**Test design techniques** (each test case is labelled with the technique it uses):

- **EP** — Equivalence Partitioning (valid / invalid classes, e.g. user types, field formats).
- **BVA** — Boundary Value Analysis (field length limits such as contact subject 5–100 characters).
- **DT** — Decision Table (combinations, e.g. checkout fields filled / empty).
- **ST** — State Transition (cart and session states, e.g. logged out → logged in → cart → checkout).
- **EG** — Error Guessing (experience-based, used for things like leading spaces or double clicks).

**Execution:** cases are executed manually step by step. To make the results repeatable and to capture
evidence (screenshots, response bodies), each case was also replayed with a small Playwright script in
`execution/`. The script only drives the browser and saves evidence; the pass/fail decision and the actual
result were checked by the tester.

## 6. Test environment

| Item | Value |
|---|---|
| OS | Windows 11 (64-bit) |
| Browsers | Chromium (Playwright build), Firefox and WebKit for the cross-browser subset |
| Screen | 1280×720 desktop; 390×844 mobile spot check |
| Network | Normal home broadband |
| Test data | Demo users published on the Sauce Demo login page; fake names, emails and phone numbers |
| Tools | Excel (test case template), Markdown, Playwright (evidence capture), GitHub Issues (defect tracking) |

## 7. Entry criteria

- Applications reachable and the main page loads.
- Test cases reviewed and stored in the workbook.
- Test data ready (demo credentials, fake customer data).

## 8. Exit criteria

- 100% of planned test cases executed (or marked Blocked with a reason).
- All Critical and Major defects reported with evidence.
- Requirements traceability matrix shows every requirement covered.
- Test summary report written with a release recommendation.

## 9. Suspension and resumption

Testing is suspended if the application is down for more than 30 minutes or the shared demo data is broken
so that more than 30% of the cases are blocked. Testing resumes when the site is reachable again and a
smoke check (login + main page) passes.

## 10. Defect management

- Every defect is reproduced at least twice before it is reported.
- Each report contains: title, environment, preconditions, steps, expected vs actual, severity, priority,
  evidence and status. Reports live in `bug-reports/` and are mirrored as GitHub Issues.
- Life cycle: **New → Open → In Progress → Fixed → Retest → Closed** (or **Rejected / Deferred**).

| Severity | Meaning |
|---|---|
| Critical | Blocks a core journey (cannot buy / cannot book), no workaround |
| Major | Core feature gives wrong result, workaround exists |
| Minor | Feature works but with a visible problem (wrong text, layout) |
| Trivial | Cosmetic, no impact on use |

| Priority | Meaning |
|---|---|
| P1 | Fix before release |
| P2 | Fix in the next release |
| P3 | Fix when time allows |

## 11. Risks and mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Shared demo data changes or resets during testing (booking platform) | Results not repeatable | Create own test data in each case; record the time of execution |
| Some Sauce Demo users have intentional defects | Many failures in one area | Report each distinct defect once; group duplicates |
| No written requirements | Wrong expected results | Derive requirements from standard-user behaviour and visible UI text; list them in the RTM |
| Site is slow or down | Blocked cases | Retry later; mark Blocked with a reason |

## 12. Schedule

| Activity | Planned effort |
|---|---|
| Requirement analysis and test scenarios | 0.5 day |
| Test plan | 0.5 day |
| Test case design (≥ 60 cases) | 1.5 days |
| Execution and evidence capture | 1.5 days |
| Exploratory sessions (3 × 45 min) | 0.5 day |
| Defect reporting and summary report | 0.5 day |

## 13. Roles and responsibilities

| Role | Person | Responsibility |
|---|---|---|
| QA engineer | Sudipta Kumar Das | Planning, design, execution, defect reporting, reporting |
| Reviewer | Peer reviewer (self-review checklist used for this portfolio) | Review of cases and reports |

## 14. Deliverables

- `docs/test-plan.md` (this document)
- `test-scenarios.md`
- `test-cases/Test_Cases_SauceDemo.xlsx`, `test-cases/Test_Cases_BookingPlatform.xlsx` (+ CSV and Markdown copies)
- `requirements-traceability-matrix.xlsx`
- `bug-reports/` and GitHub Issues
- `exploratory/` session notes
- `reports/test-summary-report.md`
