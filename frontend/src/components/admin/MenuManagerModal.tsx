import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MenuItem } from '../../types';

interface MenuManagerModalProps {
  adminSecret: string;
  onClose: () => void;
}

export const MenuManagerModal: React.FC<MenuManagerModalProps> = ({
  adminSecret,
  onClose,
}) => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(6000);

  const fetchMenus = async () => {
    try {
      const list = await api.getMenus(true);
      setMenus(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleToggleStock = async (menu: MenuItem) => {
    try {
      await api.deleteMenu(menu.id, adminSecret);
      fetchMenus();
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status ketersediaan');
    }
  };

  const handleSavePrice = async (menu: MenuItem) => {
    try {
      await api.updateMenu(menu.id, { price: editPrice }, adminSecret);
      setEditingId(null);
      fetchMenus();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan harga');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              restaurant_menu
            </span>
            <h3 className="text-base font-bold text-slate-800">
              Kelola Menu & Ketersediaan Stok
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 flex-1 no-scrollbar">
          {menus.map((m) => (
            <div
              key={m.id}
              className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{m.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      m.is_available
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {m.is_available ? 'Tersedia' : 'Habis'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  {editingId === m.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-24 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold"
                      />
                      <button
                        onClick={() => handleSavePrice(m)}
                        className="px-2 py-1 bg-primary text-white rounded text-xs font-bold"
                      >
                        Simpan
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-primary">
                        Rp {m.price.toLocaleString('id-ID')}
                      </span>
                      <button
                        onClick={() => {
                          setEditingId(m.id);
                          setEditPrice(m.price);
                        }}
                        className="text-[11px] text-slate-400 hover:text-primary font-medium underline"
                      >
                        Ubah Harga
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Toggle Button */}
              <button
                onClick={() => handleToggleStock(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  m.is_available
                    ? 'bg-white border border-rose-300 text-rose-600 hover:bg-rose-50'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {m.is_available ? 'Tandai Habis' : 'Aktifkan'}
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-md"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
