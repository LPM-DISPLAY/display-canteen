# Feature Specification: DISPLAY Canteen MVP

**Feature Branch**: `001-canteen-mvp`

**Created**: 2026-11-04

**Status**: Draft

**Input**: User description: "001-canteen-mvp: Membuat sistem pemesanan kantin, checkout QRIS, live order queue, dan admin dashboard berdasarkan PRD.md dan DESIGN.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive Roti Bakar Customizer & Cash Checkout (Priority: P1)

As a canteen visitor (guest), I want to visually customize my Roti Bakar on my smartphone by selecting from 6 flavor variants (Cokelat, Keju, Strawberry, Blueberry, Tiramisu, Green Tea) with lively animated topping feedback, and place my order using my name and WhatsApp number without creating an account or logging in, so that I can order a delicious custom toast quickly with minimal friction.

**Why this priority**: Core value proposition of the canteen application. Empowers guests to construct their preferred toast combination interactively and checkout with zero barrier to entry.

**Independent Test**: Can be tested end-to-end by opening the application as an unauthenticated guest, viewing the central toast canvas, selecting flavors (e.g., Cokelat and Keju) with bounce animation, adding to cart, submitting checkout with "Name" and "WhatsApp", selecting "Cash", and receiving an active order tracking confirmation showing the chosen flavors.

**Acceptance Scenarios**:

1. **Given** a guest opens the canteen application on a mobile device, **When** they view the ordering screen, **Then** a prominent Roti Bakar canvas is centered with 6 selectable flavor options (Cokelat, Keju, Strawberry, Blueberry, Tiramisu, Green Tea).
2. **Given** a guest taps a flavor option, **When** the flavor is selected, **Then** a visual topping layer appears on top of the toast canvas with a lightweight bounce animation, and the item's summary and price reflect the selection.
3. **Given** a guest has finalized their flavor selection and added it to the cart, **When** they proceed to checkout, enter their name and valid WhatsApp number, select "Cash", and submit, **Then** the order is registered with status `PENDING_PAYMENT` with line items detailing the selected flavors, and instructions are shown to pay at the cashier.

---

### User Story 2 - QRIS Payment & Transfer Proof Upload (Priority: P2)

As a canteen guest who prefers digital payment, I want to scan a static QRIS code displayed on my screen and upload a screenshot of my payment transfer receipt, so that the cashier can verify my payment without requiring manual bank matching.

**Why this priority**: Essential payment pathway for cashless transactions, allowing non-cash transactions to be processed asynchronously without formal bank payment gateway credentials.

**Independent Test**: Can be tested independently by choosing "QRIS" during checkout, viewing the static QR code, uploading an image receipt, and verifying that the order updates to `VERIFYING_PAYMENT`.

**Acceptance Scenarios**:

1. **Given** a guest is at the checkout payment selection step, **When** they select "QRIS", **Then** the static QRIS QR code is clearly displayed alongside payment instructions and an image upload form.
2. **Given** a guest has transferred funds, **When** they upload their payment receipt image and tap submit, **Then** the receipt is securely stored, and the order status automatically updates to `VERIFYING_PAYMENT`.

---

### User Story 3 - Live Order Status Tracking & Queue Wait Estimation (Priority: P3)

As a canteen guest waiting for my food, I want to see real-time updates of my order status and a dynamic estimated ready time, so that I know exactly when to walk up to the counter and collect my meal.

**Why this priority**: Enhances customer experience, prevents crowding around the counter, and sets clear waiting expectations.

**Independent Test**: Can be tested by opening an active order status page and changing the order state from the administrative side to `PROCESSING`, verifying that the queue position and estimated completion time appear immediately.

**Acceptance Scenarios**:

1. **Given** a guest has submitted an order, **When** they visit or refresh their order status page, **Then** they see their current order state (`PENDING_PAYMENT`, `VERIFYING_PAYMENT`, `PROCESSING`, `READY`, `COMPLETED`, or `CANCELLED`).
2. **Given** an order is marked as `PROCESSING`, **When** the guest views their tracking page, **Then** the remaining estimated wait time and preparation queue status are clearly displayed.

---

### User Story 4 - Admin Order Lifecycle & WhatsApp Notification (Priority: P4)

As an on-duty canteen PIC (cashier/admin), I want a centralized dashboard showing incoming orders, uploaded payment proofs, and order stage progression, plus a single-click button to notify customers via WhatsApp when food is ready, so that order handoff is swift and organized.

**Why this priority**: Empowers rotating PIC members to process orders rapidly and notify guests without manual phone contact typing.

**Independent Test**: Can be tested by accessing the administrative dashboard, verifying a pending QRIS payment proof, moving the order from `VERIFYING_PAYMENT` to `PROCESSING`, advancing to `READY`, and clicking "Notify via WhatsApp" to verify that a pre-formatted message link is created.

**Acceptance Scenarios**:

1. **Given** incoming guest orders exist, **When** the PIC views the order management board, **Then** orders are organized by status column/filter, showing customer name, WhatsApp contact, items, and payment proof thumbnail.
2. **Given** a guest uploaded a QRIS payment receipt, **When** the PIC clicks the receipt preview, **Then** the receipt is displayed in full resolution for quick verification.
3. **Given** an order is ready for pickup, **When** the PIC marks the order as `READY` and clicks "Kabari User", **Then** the system opens a direct WhatsApp messaging link populated with the guest's number and a customized pickup message.

---

### User Story 5 - Menu Catalog Management & Shift Sales CSV Export (Priority: P5)

As an on-duty canteen PIC completing a shift, I want to manage item availability and download a complete sales recap in CSV format, so that I can report sales figures and revenues to the team group chat or cloud drive.

**Why this priority**: Closes the operational loop for daily shift reporting and inventory availability control.

**Independent Test**: Can be tested by toggling a menu item to inactive, verifying it disappears from the guest catalog, and clicking "Export CSV" on the sales recap screen to download transaction records.

**Acceptance Scenarios**:

1. **Given** a menu item is sold out, **When** the PIC toggles the item status in the admin menu manager, **Then** the item is immediately disabled or hidden in the guest catalog.
2. **Given** completed orders have accumulated over the shift, **When** the PIC navigates to the sales dashboard and clicks "Export CSV", **Then** a structured spreadsheet file containing order IDs, guest names, item details, payment types, and revenue amounts is downloaded immediately.

---

### Edge Cases

- **Invalid or formatted WhatsApp numbers**: When a guest inputs an international, spaced, or dashed phone number (e.g., `+62 812-3456-7890`), the system cleanses and standardizes the phone number so WhatsApp messaging links function seamlessly.
- **Corrupt or non-image upload**: When a guest attempts to upload a non-image file or an image exceeding allowed size limits for QRIS verification, the system displays an explicit, friendly error and prompts re-upload without discarding the order.
- **Multiple simultaneous orders in queue**: When multiple orders enter `PROCESSING` concurrently, each subsequent order's estimated ready time cumulatively factors in prior orders currently in preparation.
- **Invalid payment proof rejected**: When an admin determines a payment receipt is invalid or unpaid, the admin can mark the order as `CANCELLED`, which immediately updates the customer's live tracking view with a clear cancellation notification.
- **Accidental mobile browser closure**: If a guest closes or refreshes their mobile browser tab while an order is active, re-opening the application restores the active order tracking state from local storage.
- **Menu item availability change during checkout**: If an item in a guest's cart is marked unavailable by the admin prior to final submission, the system alerts the guest before finalizing payment.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide an interactive mobile-optimized Roti Bakar customizer displaying a central toast stage and 6 selectable flavor options (Cokelat, Keju, Strawberry, Blueberry, Tiramisu, Green Tea) with a flat price of Rp 6.000 per roti and a maximum selection of 2 flavor toppings per roti without requiring account registration.
- **FR-002**: The system MUST trigger an interactive visual bounce animation applying or removing topping layers when a flavor option is selected or deselected on the toast canvas.
- **FR-003**: The system MUST support an interactive shopping cart allowing guests to add custom Roti Bakar combinations, adjust quantities, review subtotal calculations, and proceed to checkout.
- **FR-004**: The system MUST capture customer identity at checkout consisting strictly of `guest_name` and `guest_wa` (WhatsApp contact).
- **FR-005**: The system MUST support both Cash payment and static QRIS code payment workflows.
- **FR-006**: When Cash payment is chosen, the system MUST register the order in `PENDING_PAYMENT` status and present instructions to settle payment at the cashier counter.
- **FR-007**: When QRIS payment is chosen, the system MUST display the static canteen QR code and provide an upload mechanism for the guest's payment proof image.
- **FR-008**: Upon successful upload of payment proof, the system MUST transition the order status to `VERIFYING_PAYMENT`.
- **FR-009**: The system MUST provide a live order tracking view that automatically updates and reflects the 6 canonical order statuses: `PENDING_PAYMENT`, `VERIFYING_PAYMENT`, `PROCESSING`, `READY`, `COMPLETED`, and `CANCELLED`.
- **FR-010**: When an order transitions to `PROCESSING`, the system MUST calculate an estimated completion time based on queued orders and display it prominently on the guest's tracking screen.
- **FR-011**: The system MUST preserve active guest order identifiers on the client device so that page reloads or tab closures do not lose the active tracking session.
- **FR-012**: The administrative dashboard (Kanban / list layout) and customer order view MUST clearly display each order's customized Roti Bakar item along with its selected flavor combination (e.g., `1x Roti Bakar (Cokelat + Keju)`).
- **FR-013**: The administrative dashboard MUST allow PICs to view and inspect uploaded payment proof images for verification before confirming payment.
- **FR-014**: The administrative dashboard MUST provide a one-click notification action ("Kabari User") generating a pre-filled direct WhatsApp link (`wa.me`) addressed to the guest when an order reaches `READY`.
- **FR-015**: The administrative dashboard MUST allow PICs to transition order states forward (`PROCESSING`, `READY`, `COMPLETED`) or reject invalid orders (`CANCELLED`).
- **FR-016**: The administrative interface MUST allow PICs to manage flavor availability, pricing tiers, and menu settings.
- **FR-017**: The administrative dashboard MUST aggregate shift metrics, including total revenue, order count, and payment method distribution.
- **FR-018**: The administrative dashboard MUST provide a one-click export feature generating a downloadable CSV file containing shift sales records.
- **FR-019**: The administrative dashboard and management endpoints MUST require administrative credential verification to prevent unauthorized access.

### Key Entities *(include if feature involves data)*

- **Menu Item**: Represents the base Roti Bakar product and its flavor options. Attributes include name, description, base price, flavor availability flags, preparation time estimate, and active status.
- **Order**: Represents a customer purchasing transaction. Attributes include unique order reference, guest name, guest WhatsApp number, payment method (Cash/QRIS), order status, payment proof reference, estimated ready timestamp, and creation/completion timestamps.
- **Order Item**: Represents an individual custom Roti Bakar ordered, capturing base item reference, list of selected flavors (e.g., `["Cokelat", "Keju"]`), line-item price, and quantity.
- **Payment Proof**: Represents the uploaded transaction screenshot or receipt image provided by the guest for QRIS verification.
- **Shift Sales Summary**: Represents aggregated operational metrics for a shift period, including total completed orders, gross revenue, cash vs. QRIS breakdown, and item volume sales.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Unauthenticated guests can open the catalog, choose items, and complete checkout in under 90 seconds.
- **SC-002**: 100% of QRIS checkout attempts display clear transfer instructions, and receipt image uploads complete and update status in under 5 seconds on standard mobile networks.
- **SC-003**: Customer live tracking views update within 5 seconds of an administrative status change.
- **SC-004**: Estimated order readiness is displayed to the customer within 3 seconds of the order entering the `PROCESSING` stage.
- **SC-005**: On-duty PICs can verify payment proof and advance an order to the kitchen queue in 3 or fewer clicks.
- **SC-006**: The customer notification action triggers a pre-filled WhatsApp conversation in under 2 seconds without requiring the cashier to save phone contacts.
- **SC-007**: Shift sales CSV export is generated and downloaded in under 5 seconds from the administrative dashboard.
- **SC-008**: 0% of active guest sessions are lost upon browser refresh or tab reopen during active order fulfillment.

## Assumptions

- Guests have smartphones with mobile browsers and access to camera/screenshot photos to upload payment receipts.
- Static QRIS payment QR image is provided by canteen management and remains valid across shifts.
- On-duty PICs have access to a web browser on desktop or laptop with WhatsApp Web or desktop WhatsApp installed to dispatch notification links.
- Internet connectivity is accessible at the canteen location for both mobile patrons and the host machine.
- Cloud-hosted database and object storage maintain order history and proof files centrally so rotating PIC hardware does not disrupt active operations.
