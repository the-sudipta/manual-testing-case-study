# Bug Reports

22 real defects, each reproduced at least twice with evidence. They are also tracked as [GitHub Issues](https://github.com/the-sudipta/manual-testing-case-study/issues).

Severity: Critical 3 · Major 12 · Minor 5 · Trivial 2

Life cycle: New → Open → In Progress → Fixed → Retest → Closed (or Rejected / Deferred).

| ID | Application | Module | Title | Severity | Priority | Status |
|---|---|---|---|---|---|---|
| [BUG-001](BUG-001-item-total-shows-an-unrounded-value-121-94999999999999-on-th.md) | Sauce Demo | Checkout | Item total shows an unrounded value $121.94999999999999 on the checkout overview | Major | P2 | Open |
| [BUG-002](BUG-002-problem-user-all-six-products-show-the-same-dog-image.md) | Sauce Demo | Products | problem_user: all six products show the same dog image | Major | P2 | Open |
| [BUG-003](BUG-003-problem-user-sorting-the-product-list-has-no-effect.md) | Sauce Demo | Sorting | problem_user: sorting the product list has no effect | Major | P2 | Open |
| [BUG-004](BUG-004-problem-user-add-to-cart-does-nothing-for-three-of-the-six-p.md) | Sauce Demo | Cart | problem_user: Add to cart does nothing for three of the six products | Major | P1 | Open |
| [BUG-005](BUG-005-problem-user-remove-button-on-the-products-page-does-not-rem.md) | Sauce Demo | Cart | problem_user: Remove button on the Products page does not remove the item | Major | P2 | Open |
| [BUG-006](BUG-006-problem-user-clicking-a-product-opens-a-different-product-pa.md) | Sauce Demo | Product details | problem_user: clicking a product opens a different product page | Major | P2 | Open |
| [BUG-007](BUG-007-problem-user-typing-in-last-name-overwrites-first-name-check.md) | Sauce Demo | Checkout | problem_user: typing in Last Name overwrites First Name, checkout cannot continue | Critical | P1 | Open |
| [BUG-008](BUG-008-error-user-sorting-shows-sorting-is-broken-alert-and-does-no.md) | Sauce Demo | Sorting | error_user: sorting shows "Sorting is broken!" alert and does not sort | Major | P2 | Open |
| [BUG-009](BUG-009-error-user-finish-button-does-nothing-the-order-cannot-be-co.md) | Sauce Demo | Checkout | error_user: Finish button does nothing, the order cannot be completed | Critical | P1 | Open |
| [BUG-010](BUG-010-error-user-last-name-field-ignores-input-but-continue-is-sti.md) | Sauce Demo | Checkout | error_user: Last Name field ignores input but Continue is still accepted | Major | P2 | Open |
| [BUG-011](BUG-011-error-user-add-to-cart-does-nothing-for-three-of-the-six-pro.md) | Sauce Demo | Cart | error_user: Add to cart does nothing for three of the six products | Major | P1 | Open |
| [BUG-012](BUG-012-visual-user-product-prices-differ-from-the-catalogue-and-cha.md) | Sauce Demo | Products | visual_user: product prices differ from the catalogue and change on every load | Major | P1 | Open |
| [BUG-013](BUG-013-performance-glitch-user-login-takes-about-5-seconds.md) | Sauce Demo | Login | performance_glitch_user: login takes about 5 seconds | Major | P2 | Open |
| [BUG-014](BUG-014-checkout-is-allowed-with-an-empty-cart-and-completes-a-0-00-.md) | Sauce Demo | Checkout | Checkout is allowed with an empty cart and completes a $0.00 order | Minor | P2 | Open |
| [BUG-015](BUG-015-reset-app-state-clears-the-badge-but-product-buttons-still-s.md) | Sauce Demo | Menu | Reset App State clears the badge but product buttons still show "Remove" | Minor | P3 | Open |
| [BUG-016](BUG-016-reservation-page-never-loads-get-api-room-id-returns-500.md) | Restful Booker Platform | Reservation | Reservation page never loads: GET /api/room/{id} returns 500 | Critical | P1 | Open |
| [BUG-017](BUG-017-check-availability-accepts-a-check-out-date-before-the-check.md) | Restful Booker Platform | Availability | Check Availability accepts a check-out date before the check-in date | Major | P2 | Open |
| [BUG-018](BUG-018-navbar-amenities-link-goes-nowhere-the-page-has-no-amenities.md) | Restful Booker Platform | Navigation | Navbar "Amenities" link goes nowhere: the page has no amenities section | Minor | P3 | Open |
| [BUG-019](BUG-019-footer-quick-links-home-rooms-booking-contact-all-point-to.md) | Restful Booker Platform | Navigation | Footer Quick Links (Home, Rooms, Booking, Contact) all point to "#" | Minor | P3 | Open |
| [BUG-020](BUG-020-contact-form-accepts-a-phone-number-made-of-letters.md) | Restful Booker Platform | Contact | Contact form accepts a phone number made of letters | Minor | P2 | Open |
| [BUG-021](BUG-021-contact-form-shows-eight-duplicated-error-messages-not-in-fo.md) | Restful Booker Platform | Contact | Contact form shows eight duplicated error messages, not in form order | Trivial | P3 | Open |
| [BUG-022](BUG-022-admin-login-page-shows-a-logout-button-before-anyone-has-log.md) | Restful Booker Platform | Admin | Admin login page shows a "Logout" button before anyone has logged in | Trivial | P3 | Open |

Note: Sauce Demo intentionally ships special users (problem_user, error_user, visual_user, performance_glitch_user)
with defects for practice. They are reported here exactly as found, the way they would be reported in a real project.
