# Test Cases — Restful Booker Platform

Generated from the workbook source. Technique: EP = Equivalence Partitioning, BVA = Boundary Value Analysis,
DT = Decision Table, ST = State Transition, EG = Error Guessing.

| Test Case ID | Module | Technique | Scenario | Test Steps | Test Data | Expected Result | Actual Result | Status | Severity | Priority | Bug ID |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-BK-001 | Home | EP | Branding and contact details | 1. Read the hero title<br>2. Read the location / contact section | - | Title "Welcome to Shady Meadows B&B"; address, phone and email shown | As expected | Pass | Minor | P2 |  |
| TC-BK-002 | Home | EP | Room list | 1. Scroll to "Our Rooms" | - | Each room shows type, price "per night" and a Book now link | As expected | Pass | Major | P1 |  |
| TC-BK-003 | Navigation | EP | Navbar Rooms link | 1. Click "Rooms" in the navbar | - | Page scrolls to the rooms section (#rooms) | As expected | Pass | Minor | P3 |  |
| TC-BK-004 | Navigation | EP | Navbar Amenities link | 1. Click "Amenities" in the navbar | - | Page scrolls to an amenities section | URL changes to /#amenities but nothing happens; the page has no amenities section | Fail | Minor | P3 | BUG-018 |
| TC-BK-005 | Navigation | EP | Footer Quick Links | 1. Click Home, Rooms, Booking, Contact in the footer | - | Each link goes to its section | All four links have href="#" and only jump to the top of the page | Fail | Minor | P3 | BUG-019 |
| TC-BK-006 | Reservation | ST | Open reservation page | 1. Click "Book now" on the first room | Room 1 | Reservation page with room details, calendar and "Reserve Now" button | Page shows a loading spinner forever; GET /api/room/1 returns 500 "Internal Server Error" | Fail | Critical | P1 | BUG-016 |
| TC-BK-007 | Reservation | EP | Reserve with valid guest details | 1. Select dates<br>2. Click Reserve Now<br>3. Enter first name, last name, email, phone<br>4. Click Reserve Now | Karim / Hasan / karim.hasan@example.com / 01812345678 | "Booking Confirmed" with the selected dates | Blocked by BUG-016: reservation page never loads | Blocked | Critical | P1 | BUG-016 |
| TC-BK-008 | Reservation | DT | Reserve with empty guest details | 1. Click Reserve Now<br>2. Leave all fields empty<br>3. Click Reserve Now | (empty) | Validation error for each empty field | Blocked by BUG-016: reservation page never loads | Blocked | Major | P2 | BUG-016 |
| TC-BK-009 | Availability | DT | Check-out before check-in | 1. Set Check In = today + 65 days<br>2. Set Check Out = today + 60 days<br>3. Click Check Availability | Reversed range | Error message; no rooms offered | No error; every room is shown with a Book now link carrying the reversed dates | Fail | Major | P2 | BUG-017 |
| TC-BK-010 | Availability | EP | Valid date range | 1. Set Check In = today + 60 days<br>2. Set Check Out = today + 62 days<br>3. Click Check Availability | 2 nights | Available rooms shown; Book now links carry the chosen dates | As expected | Pass | Major | P1 |  |
| TC-BK-011 | Contact | EP | Send a valid message | 1. Fill all fields with valid data<br>2. Click Submit | Nusrat Jahan / nusrat.jahan@example.com / 01712345678 | "Thanks for getting in touch Nusrat Jahan!" | As expected | Pass | Major | P1 |  |
| TC-BK-012 | Contact | DT | Submit an empty form | 1. Leave all fields empty<br>2. Click Submit | (all empty) | "may not be blank" error for Name, Email, Phone, Subject and Message | As expected | Pass | Major | P2 |  |
| TC-BK-013 | Contact | EP | Invalid email format | 1. Enter an email without @<br>2. Click Submit | nusrat.example.com | Error "must be a well-formed email address" | As expected | Pass | Major | P2 |  |
| TC-BK-014 | Contact | BVA | Subject 4 characters (min − 1) | 1. Enter a 4-character subject<br>2. Click Submit | aaaa | Error "Subject must be between 5 and 100 characters." | As expected | Pass | Minor | P2 |  |
| TC-BK-015 | Contact | BVA | Subject 5 characters (min) | 1. Enter a 5-character subject<br>2. Click Submit | aaaaa | Message accepted | As expected | Pass | Minor | P2 |  |
| TC-BK-016 | Contact | BVA | Subject 101 characters (max + 1) | 1. Enter a 101-character subject<br>2. Click Submit | "a" × 101 | Error "Subject must be between 5 and 100 characters." | As expected | Pass | Minor | P2 |  |
| TC-BK-017 | Contact | BVA | Subject 100 characters (max) | 1. Enter a 100-character subject<br>2. Click Submit | "a" × 100 | Message accepted | As expected | Pass | Minor | P2 |  |
| TC-BK-018 | Contact | BVA | Message 19 characters (min − 1) | 1. Enter a 19-character message<br>2. Click Submit | "a" × 19 | Error "Message must be between 20 and 2000 characters." | As expected | Pass | Minor | P2 |  |
| TC-BK-019 | Contact | BVA | Message 20 characters (min) | 1. Enter a 20-character message<br>2. Click Submit | "a" × 20 | Message accepted | As expected | Pass | Minor | P2 |  |
| TC-BK-020 | Contact | BVA | Phone 10 digits (min − 1) | 1. Enter a 10-digit phone<br>2. Click Submit | 0171234567 | Error "Phone must be between 11 and 21 characters." | As expected | Pass | Minor | P2 |  |
| TC-BK-021 | Contact | BVA | Phone 11 digits (min) | 1. Enter an 11-digit phone<br>2. Click Submit | 01712345678 | Message accepted | As expected | Pass | Minor | P2 |  |
| TC-BK-022 | Contact | EP | Phone made of letters (invalid class) | 1. Enter letters in Phone<br>2. Click Submit | abcdefghijk | Error: phone must contain digits only | Message accepted (HTTP 200, "Thanks for getting in touch"); only the length is checked | Fail | Minor | P2 | BUG-020 |
| TC-BK-023 | Contact | EG | Clarity of validation messages | 1. Leave all fields empty<br>2. Click Submit<br>3. Read the error box | (all empty) | One clear message per field, in form order | Eight messages in one box, not in form order; Subject, Message and Phone get two messages each | Fail | Trivial | P3 | BUG-021 |
| TC-BK-024 | Admin | EP | Admin login with valid credentials | 1. Enter admin / password<br>2. Click Login | admin / password (published demo credentials) | Admin rooms page with Rooms, Report, Branding, Messages | As expected | Pass | Critical | P1 |  |
| TC-BK-025 | Admin | EP | Admin login with wrong password | 1. Enter admin / wrong password<br>2. Click Login | admin / wrong-password | "Invalid credentials" and user stays on the login page | As expected | Pass | Major | P1 |  |
| TC-BK-026 | Admin | ST | Admin logout | 1. Click Logout<br>2. Open /admin again | - | Front page opens; /admin asks for login again | As expected | Pass | Major | P1 |  |
| TC-BK-027 | Policies | EP | Cookie policy page | 1. Click "Cookie-Policy" in the footer | - | /cookie shows "Cookie Policy" | As expected | Pass | Trivial | P3 |  |
| TC-BK-028 | Policies | EP | Privacy policy page | 1. Click "Privacy-Policy" in the footer | - | /privacy shows "Privacy Policy Notice" | As expected | Pass | Trivial | P3 |  |
| TC-BK-029 | Admin | ST | Navbar before admin login | 1. Look at the admin navbar before logging in | - | No Logout button while logged out | "Logout" button is shown on the login page | Fail | Trivial | P3 | BUG-022 |
