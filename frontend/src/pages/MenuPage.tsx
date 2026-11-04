import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { MenuItem, FlavorVariant } from '../types';
import { useCart } from '../context/CartContext';
import { Header } from '../components/common/Header';
import { RotiCustomizer } from '../components/guest/RotiCustomizer';
import { FlavorSelector } from '../components/guest/FlavorSelector';
import { CartDrawer } from '../components/guest/CartDrawer';
import { CartBottomBar } from '../components/guest/CartBottomBar';
import { OrdersDrawer } from '../components/guest/OrdersDrawer';

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [menu, setMenu] = useState<MenuItem | null>(null);
  const [selectedFlavors, setSelectedFlavors] = useState<FlavorVariant[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  useEffect(() => {
    async function loadMenu() {
      try {
        const list = await api.getMenus();
        if (list.length > 0) {
          setMenu(list[0]);
        }
      } catch (err) {
        console.error('Failed to load menu:', err);
      }
    }
    loadMenu();
  }, []);

  const handleToggleFlavor = (flavor: FlavorVariant) => {
    setSelectedFlavors((prev) => {
      if (prev.includes(flavor)) {
        return prev.filter((f) => f !== flavor);
      } else {
        // Max 2 flavors per roti
        if (prev.length >= 2) return prev;
        return [...prev, flavor];
      }
    });
  };

  const handleRemoveFlavor = (flavor: FlavorVariant) => {
    setSelectedFlavors((prev) => prev.filter((f) => f !== flavor));
  };

  // Flat price per roti: Rp 6.000 regardless of toppings count (max 2)
  const basePrice = menu?.price || 6000;
  const unitPrice = basePrice;
  const itemTotal = unitPrice * quantity;

  const handleAddToCart = () => {
    if (!menu) return;

    const itemName =
      selectedFlavors.length === 0
        ? 'Roti Bakar Original'
        : menu.name;

    addItem({
      menu_id: menu.id,
      name: itemName,
      flavors: [...selectedFlavors],
      price: unitPrice,
      quantity,
      notes: notes.trim() || undefined,
    });

    // Reset notes, keep flavor for quick multi-order, and trigger confirmation toast
    setNotes('');
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] flex flex-col justify-between pb-24 relative shadow-lg">
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      {/* Added Toast Notification */}
      {showAddedToast && (
        <div className="fixed top-14 inset-x-0 z-50 flex justify-center pointer-events-none px-4 animate-fade-in">
          <div className="bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Roti Bakar masuk ke keranjang!
          </div>
        </div>
      )}

      <main className="flex-1 px-3.5 pt-2 space-y-2.5">
        {/* Center Toast Customizer Stage (Compact & Single-screen fit) */}
        <div className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-xs flex flex-col items-center">
          <RotiCustomizer
            selectedFlavors={selectedFlavors}
            onRemoveFlavor={handleRemoveFlavor}
            compact={true}
          />

          {/* Unit Price & Quantity Stepper */}
          <div className="w-full mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Harga Flat (Maks. 2 Topping)
              </span>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                Rp {unitPrice.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Kurangi jumlah"
                className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700 active:scale-90 font-bold text-xs"
              >
                -
              </button>
              <span className="text-xs font-bold text-slate-800 min-w-4 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Tambah jumlah"
                className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700 active:scale-90 font-bold text-xs"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Flavor Selector Swatches & Add Action */}
        <div className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-xs space-y-2">
          <FlavorSelector
            selectedFlavors={selectedFlavors}
            onToggleFlavor={handleToggleFlavor}
            maxFlavors={2}
          />

          {/* Notes Input */}
          <div>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan khusus (misal: jangan terlalu gosong)..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
            <span>
              {selectedFlavors.length === 0
                ? `Tambah Roti Original - Rp ${itemTotal.toLocaleString('id-ID')}`
                : `Tambah ke Keranjang - Rp ${itemTotal.toLocaleString('id-ID')}`}
            </span>
          </button>
        </div>
      </main>

      {/* Sticky High-Contrast Bottom Cart Bar */}
      <CartBottomBar
        onOpenCart={() => setIsCartOpen(true)}
        onCheckout={() => navigate('/checkout')}
      />

      {/* Cart Drawer Modal */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          navigate('/checkout');
        }}
      />

      {/* My Orders History Drawer */}
      <OrdersDrawer
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />
    </div>
  );
};
