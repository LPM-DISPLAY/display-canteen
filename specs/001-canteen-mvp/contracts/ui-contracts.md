# UI Contracts & Screen Mapping: DISPLAY Canteen MVP

**Feature**: `001-canteen-mvp`
**Design Reference**: `DESIGN.md` & `docs/stitch-designs/`

## 1. Route Contracts

| Route | Target Audience | Prototype Reference | Key Functional Capabilities |
|---|---|---|---|
| `/` | Guest (Customer) | `screen-1-menu-mobile.html` (adapted) | Interactive Roti Bakar Customizer stage, flavor palette, bounce topping animation, cart drawer |
| `/checkout` | Guest (Customer) | `screen-2-payment-mobile.html` | Enter `guest_name` and `guest_wa`, select CASH or QRIS, static QRIS display & image receipt upload |
| `/orders/:id` | Guest (Customer) | `screen-3-status-mobile.html` | Real-time status stepper, estimated completion countdown timer, order item recap |
| `/admin` | Canteen PIC | `screen-4-admin-kanban-desktop.html`| Status Kanban board, receipt modal verification, "Kabari User" `wa.me` trigger button, order status transition actions |
| `/admin/menus` | Canteen PIC | Admin modal / manager | Create menu item, update price, toggle stock availability |
| `/admin/reports` | Canteen PIC | `screen-5-sales-recap-desktop.html`| Revenue KPIs, payment method breakdown, transaction ledger table, "Export CSV" trigger |

---

## 2. Design System Tokens & Semantic Badges

All UI components MUST adhere strictly to the design tokens defined in `DESIGN.md`:

### Color Tokens
- Canvas Background: `#F8FAFC` (`bg-slate-50`)
- Container Card Surface: `#FFFFFF` (`bg-white`)
- Primary Brand Blue: `#0057B8` (`bg-[#0057B8]`, `text-[#0057B8]`)
- Secondary Accent Orange: `#FF6B00` (`bg-[#FF6B00]`, `text-[#FF6B00]`)
- Tertiary Emerald Green: `#10B981` (`bg-emerald-500`, `text-emerald-600`)
- Text Primary: `#0F172A` (`text-slate-900`)
- Text Muted: `#475569` (`text-slate-600`)

### Flavor Visual Tokens & Animation
| Flavor | Visual Tint / Accent | Topping Texture / Graphic Element |
|---|---|---|
| **Cokelat** | `#4A2810` (Dark Cocoa) | Chocolate drizzle stripes & chocolate crisp flakes |
| **Keju** | `#F59E0B` (Golden Cheddar) | Shredded cheese curls & butter gloss |
| **Strawberry** | `#E11D48` (Vibrant Berry Red) | Glazed fruit coulis & seeds texture |
| **Blueberry** | `#4338CA` (Deep Indigo Blue) | Wild blueberry jam glaze with berry droplets |
| **Tiramisu** | `#92400E` (Espresso Cocoa) | Mascarpone cream layer & cocoa powder dusting |
| **Green Tea** | `#65A30D` (Matcha Lime Green) | Fine matcha powder mist & green tea ganache drizzle |

#### Topping Bounce Animation Keyframe
```css
@keyframes toppingBounce {
  0% {
    transform: translateY(-24px) scale(0.85);
    opacity: 0;
  }
  60% {
    transform: translateY(4px) scale(1.05);
    opacity: 1;
  }
  80% {
    transform: translateY(-2px) scale(0.98);
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
.animate-topping-bounce {
  animation: toppingBounce 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
```

### The 6 Semantic Status Badges
| Order Status | Visual Badge Classes | Label |
|---|---|---|
| `PENDING_PAYMENT` | `bg-amber-50 text-amber-700 border border-amber-200` | Menunggu Pembayaran |
| `VERIFYING_PAYMENT` | `bg-blue-50 text-blue-700 border border-blue-200` | Verifikasi Pembayaran |
| `PROCESSING` | `bg-orange-50 text-orange-700 border border-orange-200` | Sedang Diproses |
| `READY` | `bg-emerald-50 text-emerald-700 border border-emerald-200` | Siap Diambil |
| `COMPLETED` | `bg-slate-100 text-slate-700 border border-slate-200` | Selesai |
| `CANCELLED` | `bg-rose-50 text-rose-700 border border-rose-200` | Dibatalkan |

---

## 3. Client State Contracts

### Guest LocalStorage Schema
Stored under key `display_canteen_guest`:
```json
{
  "active_order_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "guest_name": "Budi Santoso",
  "guest_wa": "6281234567890",
  "recent_orders": [
    "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
  ]
}
```

### Guest Cart State (In-Memory React Context)
```typescript
interface CartItem {
  menu_id: string;
  name: string;
  flavors: string[];
  price: number;
  quantity: number;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
}
```
