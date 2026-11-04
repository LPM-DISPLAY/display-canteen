# UI Contracts & Screen Mapping: Feature 002

**Feature**: `002-visual-and-queue`  
**Design Reference**: `DESIGN.md` & `specs/002-visual-and-queue/spec.md`  

## 1. Route Contracts

| Route | Target Audience | Key Components | Key Capabilities |
|---|---|---|---|
| `/` | Guest (Customer) | `MenuPage`, `RotiCustomizer`, `FlavorSelector`, `CartBottomBar` | Realistic sliced toast SVG, 50:50 jam split, 0-topping default, single-screen fit |
| `/queue` | Public / TV Display | `PublicQueuePage`, `QueueColumn` | High-visibility board for PROCESSING & READY orders, 8s auto-poll |
| `/orders/:id` | Guest (Customer) | `StatusPage`, `StatusStepper` | Active tracking, self-service cancellation button for PENDING_PAYMENT |
| `/admin` | Canteen PIC | `AdminKanban`, `SearchBar`, `FilterPills` | Search query, Cash/QRIS toggle filter, synthesized audio notification chime |

---

## 2. Component Contracts

### `RotiCustomizer`
```typescript
interface RotiCustomizerProps {
  selectedFlavors: FlavorVariant[];
  onRemoveFlavor: (flavor: FlavorVariant) => void;
  compact?: boolean;
}
```
- **0 Toppings**: Renders plain toasted sliced bread with warm golden-brown crust, grilled toasted markings, and glistening melted butter highlights.
- **1 Jam**: Full surface glossy spread layer with jam-specific color tint and light reflection.
- **2 Jams**: Slices canvas down the center (`clipPath`), left half Jam 1, right half Jam 2.
- **1 Jam + 1 Sprinkle/Shred**: Jam forms full bottom layer; Meses or Shredded Cheese appears on top.
- **1 Meses + 1 Shredded Cheese**: Both toppings distributed harmoniously over toasted bread.

### `Header`
- Left: DISPLAY Canteen brand logo + subtitle `"Spesialis Roti Bakar"`.
- Right: Dual action icons:
  1. **"Pesanan Saya" (Receipt icon)**: Opens sliding drawer of past/active orders.
  2. **"Keranjang" (Shopping bag icon)**: Badge with total item count, opens cart drawer.

### `CartBottomBar`
- Fixed to bottom of screen (`fixed bottom-0 inset-x-0`).
- Background: `#0057B8` (Primary brand blue) with white text.
- Left: Item count & total price (e.g. `1 Roti • Rp 6.000`).
- Right: "Lihat Keranjang" / "Checkout" button.
- Bottom padding: `pb-[calc(env(safe-area-inset-bottom)+0.75rem)]`.

### `PublicQueuePage` (`/queue`)
- Layout: 2 large columns on desktop/tablet/TV, responsive stacked on mobile.
- Left column: **Sedang Disiapkan** (Warm amber/blue accent `#0057B8`), shows order number & guest first name with pulsing preparation badge.
- Right column: **Siap Diambil** (Vibrant emerald `#10B981`), shows order numbers with blinking ready indicator.
- Top bar: DISPLAY Canteen logo + Live Server Clock (WIB) + Polling pulse indicator.
