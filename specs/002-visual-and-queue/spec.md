# Feature Specification: Visual Realism, Order Management & Public Queue Display

**Feature Branch**: `002-visual-and-queue`  
**Created**: 2026-11-05  
**Status**: Draft  
**Input**: Feedback review from GitHub Issue #3 ("revisi dari puspa untuk spec selanjutnya") and user grill-me interview alignment.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Realistic Sliced Toast Canvas & Authentic Topping Layers (Priority: P1)

As a canteen visitor customizing my toast, I want the customizer canvas to look like authentic Indonesian sliced toast (*roti tawar bakar*) with realistic topping visuals (chocolate meses sprinkles, generous shredded cheddar cheese, glossy jam spread, and a 50:50 split when two jams are selected), starting with an empty topping state by default, so that I can visualize my actual order appetizingly and choose 0 to 2 toppings effortlessly.

**Why this priority**: Directly solves the core visual critique in Issue #3 (*"grafiknya harus kayak roti bakar sungguhan"*). Anchors the entire ordering experience on authenticity.

**Independent Test**: Can be tested independently by opening the ordering screen, verifying that the toast displays as a sliced bread with toasted crust and zero toppings selected initially, selecting "Cokelat" (renders chocolate meses), selecting "Keju" (renders shredded cheese curls over meses), or selecting two jams (e.g. Strawberry + Blueberry, renders split 50:50 left-right), and adding to cart even with 0 toppings (Original Mentega) for flat Rp 6.000.

**Acceptance Scenarios**:
1. **Given** a guest opens `/`, **When** the page loads, **Then** the customizer presents a sliced toast canvas with realistic toasted crust and butter sheen, with initial toppings completely empty (`[]`).
2. **Given** an empty topping selection, **When** the guest clicks "Tambah ke Keranjang", **Then** the item is added as "Roti Bakar Original" at the flat price of Rp 6.000.
3. **Given** a guest selects "Cokelat", **When** rendered, **Then** chocolate sprinkles (*meses*) appear across the bread with a bounce animation.
4. **Given** a guest selects "Keju", **When** rendered, **Then** a dense layer of shredded cheddar cheese curls appears.
5. **Given** a guest selects two jam flavors (e.g., Strawberry + Blueberry, or Tiramisu + Green Tea), **When** rendered, **Then** the toast visually splits 50:50 (left side Flavor A, right side Flavor B).
6. **Given** a guest selects a jam plus a sprinkle/cheese (e.g., Strawberry + Keju), **When** rendered, **Then** the jam forms a full spread layer and the shredded cheese/meses is sprinkled over it.

---

### User Story 2 - Single-Screen Fit Layout & High-Visibility Shopping Cart (Priority: P1)

As a mobile visitor, I want the ordering screen to fit cleanly within my smartphone screen without excessive vertical scrolling, and I want the cart to be clearly visible at both the top header and bottom bar, so that I can immediately see what I have ordered and proceed to checkout without friction.

**Why this priority**: Resolves the UX issues reported: *"UX keranjang kurang kelihatan"* and *"rasio layar"* on mobile devices.

**Independent Test**: Can be tested on various mobile viewport heights (375px to 844px), verifying that the toast stage, compact 6-swatch topping selector, and sticky bottom cart bar fit on screen with no clipping, and that tapping the header cart icon or bottom cart bar opens the checkout flow.

**Acceptance Scenarios**:
1. **Given** a user opens the mobile menu on a smartphone, **When** viewing the screen, **Then** the canvas, 6 topping buttons, and cart controls are visible within a single viewport without requiring extensive scrolling.
2. **Given** a user has items in their cart, **When** looking at the top navigation header, **Then** a shopping cart icon with a numerical badge displaying total item quantity is prominently shown.
3. **Given** items are added to the cart, **When** the user looks at the bottom of the screen, **Then** a high-contrast sticky bottom bar displays the item count, total price, and "Checkout" button with mobile safe-area padding.

---

### User Story 3 - UI Copy & Visual De-Cluttering (Priority: P2)

As a visitor and admin, I want all obsolete prototype copy removed ("Meja Stand", "Hangat" in "Spesialis Roti Bakar", "Fresh Toasted", and top promotional banners), so that the interface is modern, concise, and focused purely on food ordering.

**Why this priority**: Directly fulfills the *"dihapus dari tampilan MVP"* requirements from Issue #3.

**Independent Test**: Can be tested by inspecting the DOM across all pages (`/`, `/checkout`, `/orders/:id`, `/admin`), verifying that "Meja Stand", "Fresh Toasted", and redundant banner text are completely removed, and the subtitle reads cleanly as "Spesialis Roti Bakar".

**Acceptance Scenarios**:
1. **Given** the customer views the Header, **When** looking at the title, **Then** it displays "DISPLAY Canteen" with the subtitle "Spesialis Roti Bakar" (without "Hangat"), and the top right contains the Cart/Orders icon instead of "Meja Stand".
2. **Given** the customer lands on `/`, **When** the customizer loads, **Then** no extraneous promotional banner appears above the bread canvas; the screen directly presents the toast customizer and topping options.

---

### User Story 4 - Customer Order History & Self-Service Cancellation (Priority: P2)

As a customer without an account, I want to access a "Pesanan Saya" (My Orders) drawer showing my active orders and past order history saved on my device, and I want the ability to cancel an order myself as long as it is still in `PENDING_PAYMENT` status, so that I have control over my order if I made a mistake before paying.

**Why this priority**: Closes the loop on customer self-service, error recovery, and order re-identification across visits.

**Independent Test**: Can be tested by completing an order, opening the "Pesanan Saya" drawer from the header, verifying that previous orders are listed with their status, and clicking "Batalkan Pesanan" on a `PENDING_PAYMENT` order to successfully transition it to `CANCELLED`.

**Acceptance Scenarios**:
1. **Given** a user has placed one or more orders, **When** they click "Pesanan Saya" in the header, **Then** a sliding drawer or modal displays active and historical orders retrieved from `localStorage`.
2. **Given** an order is in `PENDING_PAYMENT` status, **When** the customer views their order details and taps "Batalkan Pesanan", **Then** the system prompts for confirmation, cancels the order, and updates status to `CANCELLED`.
3. **Given** an order has already transitioned to `PROCESSING`, `READY`, or `COMPLETED`, **When** the customer views the order, **Then** the cancel button is disabled/hidden, instructing them to contact the cashier directly.

---

### User Story 5 - Public Order Queue Display Screen (`/queue`) (Priority: P3)

As a canteen visitor waiting at a table or looking at the counter TV monitor, I want to view a dedicated public queue screen at `/queue` showing orders currently "Sedang Disiapkan" (Processing) and "Siap Diambil" (Ready) that automatically updates every 5–10 seconds, so that I can see when my order number is ready without logging in or repeatedly asking the cashier.

**Why this priority**: Essential food court / canteen experience for rotating visitors and wall-mounted TV monitors.

**Independent Test**: Can be tested by navigating to `/queue` in a browser (desktop/TV landscape or mobile portrait), verifying that orders in `PROCESSING` and `READY` appear in clear, large-font columns, and verifying that status transitions made in the Admin dashboard update the `/queue` display within 10 seconds without manual page reload.

**Acceptance Scenarios**:
1. **Given** any person opens `/queue`, **When** the page renders, **Then** it presents a high-visibility two-column dashboard: "Sedang Disiapkan" (`PROCESSING`) and "Siap Diambil" (`READY`).
2. **Given** a new order enters `PROCESSING` or transitions to `READY`, **When** the background polling runs (every 5-10 seconds), **Then** the order number and guest first name smoothly appear in the respective column.
3. **Given** an order is marked `COMPLETED` or `CANCELLED`, **When** the board refreshes, **Then** the order disappears from the active queue board.

---

### User Story 6 - Admin Operations Suite (Search, Filter & Audio Chime) (Priority: P3)

As an on-duty canteen PIC, I want to quickly search orders by customer name or order number, filter by payment method (Cash vs QRIS), and hear an audible notification chime whenever a new order arrives, so that I never miss an incoming order during busy lunch rush hours.

**Why this priority**: Streamlines operational efficiency for rotating PICs on laptop screens.

**Independent Test**: Can be tested on `/admin` by typing a customer name into the search bar, toggling the Cash/QRIS filter, and placing a new test order in another tab to verify that the incoming order sound plays and the order card highlights.

**Acceptance Scenarios**:
1. **Given** the PIC is on `/admin`, **When** they type an order number or customer name in the search bar, **Then** the Kanban board immediately filters cards matching the query.
2. **Given** the PIC clicks the "QRIS" filter button, **When** applied, **Then** only QRIS orders are shown.
3. **Given** the PIC has the admin board open, **When** a new order is submitted by a customer, **Then** a gentle audio chime plays and the order count badge updates.

---

### User Story 7 - Standardized Asia/Jakarta (WIB / UTC+7) Time Formatting (Priority: P4)

As a customer and admin, I want all displayed timestamps (order created time, estimated ready time, queue updates, and exported CSV timestamps) to be formatted in Asia/Jakarta timezone (UTC+7) with an explicit "WIB" suffix, so that there is zero confusion between server UTC time and local Indonesian canteen time.

**Why this priority**: Fulfills the Issue #3 requirement: *"waktu ke UTC+7 (jakarta)"*. Eliminates timezone offset confusion.

**Independent Test**: Can be tested by checking the timestamp on order cards, the order status page, and the exported CSV file, verifying that all times match WIB (e.g., `13:45 WIB` or `2026-11-05 13:45:00 WIB`).

**Acceptance Scenarios**:
1. **Given** an order created at `06:00:00Z` (UTC), **When** displayed in the customer UI or admin board, **Then** the time renders as `13:00 WIB`.
2. **Given** the admin clicks "Unduh CSV", **When** the spreadsheet is generated, **Then** the transaction time column contains formatted timestamps in WIB.

---

## Edge Cases

- **Zero Toppings Selected**: User adds a plain toast to cart. System records `flavors: []`, item name "Roti Bakar Original", price Rp 6.000, and backend accepts it without validation errors.
- **Two Jams Selected**: Customizer splits canvas down the center (50:50) with left side colored/textured for Jam 1 and right side for Jam 2, with a realistic blended seam.
- **One Jam + One Sprinkle/Shred**: Jam is rendered across the whole slice as a base coat; sprinkles/shredded cheese are layered on top across the surface.
- **Customer Tries to Cancel Processing Order**: If status is already `PROCESSING` or beyond, the cancel request returns HTTP 400 with message *"Pesanan sudah mulai diproses di dapur dan tidak dapat dibatalkan"*.
- **TV Display Polling Resilience**: The `/queue` route runs background polling every 8 seconds. If the network drops momentarily, it shows a subtle offline indicator and reconnects automatically without crashing the browser tab.
- **Audio Autoplay Policy**: Web browsers require user interaction before allowing audio playback. The admin board provides an "Aktifkan Audio Notifikasi" toggle with audio permission unlock on first click.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The customizer MUST render a realistic sliced bread (*roti tawar slice*) canvas with toasted crust borders, butter gloss highlights, and authentic topping visuals.
- **FR-002**: Chocolate flavor MUST be rendered as realistic chocolate sprinkles (*meses*).
- **FR-003**: Cheese flavor MUST be rendered as realistic shredded cheddar curls (*keju parut*).
- **FR-004**: Fruit and specialty flavors (Strawberry, Blueberry, Tiramisu, Green Tea) MUST be rendered as glossy jam spreads.
- **FR-005**: When two jam flavors are chosen, the canvas MUST render a 50:50 split (half-and-half) layout.
- **FR-006**: When a jam and a sprinkle/shred topping are chosen, the jam MUST serve as the base spread with sprinkles/shreds layered on top.
- **FR-007**: The initial topping selection on page load MUST be empty (`[]`).
- **FR-008**: Customers MUST be permitted to add a 0-topping Roti Bakar Original to their cart for the flat price of Rp 6.000.
- **FR-009**: The mobile viewport MUST fit the toast stage, compact 6-flavor selector, and bottom cart within a single mobile screen height without requiring scrolling on standard viewports.
- **FR-010**: The header MUST feature a persistent shopping cart icon with a dynamic item count badge.
- **FR-011**: The bottom of the ordering screen MUST feature a high-contrast sticky cart bar with safe-area padding.
- **FR-012**: All obsolete text ("Meja Stand", "Hangat" in header subtitle, "Fresh Toasted", and top promotional banner) MUST be deleted from the application.
- **FR-013**: The system MUST provide a "Pesanan Saya" (My Orders) drawer accessible from the navigation header, listing active and past orders from `localStorage`.
- **FR-014**: Customers MUST be able to self-cancel an order while its status is `PENDING_PAYMENT`.
- **FR-015**: The backend MUST expose a `POST /api/orders/{id}/cancel` endpoint allowing cancellation if and only if status is `PENDING_PAYMENT`.
- **FR-016**: The system MUST provide a public display screen at `/queue` showcasing `PROCESSING` ("Sedang Disiapkan") and `READY` ("Siap Diambil") orders in high-visibility large typography.
- **FR-017**: The `/queue` screen MUST automatically poll and refresh order statuses every 5–10 seconds.
- **FR-018**: The admin board MUST provide a search input filtering orders by guest name and order number.
- **FR-019**: The admin board MUST provide quick filters for payment method (All, Cash, QRIS).
- **FR-020**: The admin board MUST support an optional audio alert chime when new orders enter `PENDING_PAYMENT` or `VERIFYING_PAYMENT`.
- **FR-021**: All timestamps displayed in the UI, API responses, and exported CSV recaps MUST be formatted in Asia/Jakarta timezone (WIB / UTC+7) with explicit "WIB" notation.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of user visits to `/` render the toast canvas, topping grid, and cart CTA within the initial viewport on mobile devices >= 375px wide.
- **SC-002**: Guests can select 0, 1, or 2 toppings and see immediate visual feedback within 100ms with zero lag.
- **SC-003**: The `/queue` public board automatically reflects admin status changes within 10 seconds without manual browser refresh.
- **SC-004**: Customers can access their previous orders via the "Pesanan Saya" drawer in 1 click from any customer page.
- **SC-005**: Self-service order cancellation for `PENDING_PAYMENT` orders executes and reflects status change in under 2 seconds.
- **SC-006**: 100% of timestamp strings in exported CSV files and UI cards display in WIB (UTC+7).
- **SC-007**: Zero instances of "Meja Stand", "Fresh Toasted", or top promotional banner remain in user-facing code.
- **SC-008**: Existing backend test suite passes 100% and new test cases for 0-topping checkout and cancellation pass 100%.
