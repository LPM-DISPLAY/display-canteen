import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { MenuItem, FlavorVariant } from '../types';
import { useCart } from '../context/CartContext';
import { Header } from '../components/common/Header';
import { RotiCustomizer } from '../components/guest/RotiCustomizer';
import { FlavorSelector } from '../components/guest/FlavorSelector';
import { CartDrawer } from '../components/guest/CartDrawer';

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [menu, setMenu] = useState<MenuItem | null>(null);
  const [selectedFlavors, setSelectedFlavors] = useState<FlavorVariant[]>(['Cokelat']);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [showAddedToast, setShowAddedToast] = useState(false);

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
        // Max 3 flavors per toast
        if (prev.length >= 3) return prev;
        return [...prev, flavor];
      }
    });
  };

  const handleRemoveFlavor = (flavor: FlavorVariant) => {
    setSelectedFlavors((prev) => prev.filter((f) => f !== flavor));
  };

  // Base price + combo calculation
  const basePrice = menu?.price || 12000;
  const comboExtra = selectedFlavors.length > 1 ? (selectedFlavors.length - 1) * 3000 : 0;
  const unitPrice = basePrice + comboExtra;
  const itemTotal = unitPrice * quantity;

  const handleAddToCart = () => {
    if (!menu) return;
    if (selectedFlavors.length === 0) {
      alert('Pilih minimal 1 varian rasa terlebih dahulu!');
      return;
    }

    addItem({
      menu_id: menu.id,
      name: menu.name,
      flavors: [...selectedFlavors],
      price: unitPrice,
      quantity,
      notes: notes.trim() || undefined,
    });

    // Reset notes and trigger confirmation toast
    setNotes('');
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] flex flex-col pb-28 relative shadow-lg">
      <Header />

      {/* Added Toast Notification */}
      {showAddedToast && (
        <div className="fixed top-16 inset-x-0 z-50 flex justify-center pointer-events-none px-4 animate-fade-in">
          <div className="bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Roti Bakar berhasil masuk keranjang!
          </div>
        </div>
      )}

      <main className="flex-1 px-4 pt-3 space-y-4">
        {/* Banner Tagline */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/15 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
            </span>
            <div>
              <p className="text-xs font-bold text-primary">Roti Bakar Hangat & Crispy</p>
              <p className="text-[11px] text-slate-500 font-medium">Bisa mix hingga 3 rasa topping lezat</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-200">
            Mulai Rp 12rb
          </span>
        </div>

        {/* Center Toast Customizer Stage */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col items-center">
          <RotiCustomizer
            selectedFlavors={selectedFlavors}
            onRemoveFlavor={handleRemoveFlavor}
          />

          {/* Unit Price Display */}
          <div className="w-full mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Harga Satuan
              </span>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                Rp {unitPrice.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700 active:scale-90 font-bold"
              >
                -
              </button>
              <span className="text-sm font-bold text-slate-800 min-w-4 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700 active:scale-90 font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Flavor Selector Swatches */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
          <FlavorSelector
            selectedFlavors={selectedFlavors}
            onToggleFlavor={handleToggleFlavor}
            maxFlavors={3}
          />

          {/* Notes Input */}
          <div className="mt-3">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan khusus (misal: jangan terlalu gosong)..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full mt-3.5 py-3 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            <span>Tambah ke Keranjang - Rp {itemTotal.toLocaleString('id-ID')}</span>
          </button>
        </div>
      </main>

      {/* Floating Bottom Drawer Cart */}
      <CartDrawer onCheckout={() => navigate('/checkout')} />
    </div>
  );
};
