import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { PaymentMethod } from '../types';
import { Header } from '../components/common/Header';
import { QRISViewer } from '../components/guest/QRISViewer';
import { ProofUpload } from '../components/guest/ProofUpload';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();

  const [guestName, setGuestName] = useState(() => {
    try {
      const saved = localStorage.getItem('display_canteen_guest');
      return saved ? JSON.parse(saved).guest_name || '' : '';
    } catch {
      return '';
    }
  });

  const [guestWa, setGuestWa] = useState(() => {
    try {
      const saved = localStorage.getItem('display_canteen_guest');
      return saved ? JSON.parse(saved).guest_wa || '' : '';
    } catch {
      return '';
    }
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center shadow-lg">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-3">
          remove_shopping_cart
        </span>
        <h2 className="text-lg font-bold text-slate-800">Keranjang Kosong</h2>
        <p className="text-xs text-slate-500 mt-1 mb-5">
          Kamu belum memilih Roti Bakar untuk dipesan.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md"
        >
          Pilih Roti Bakar
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!guestName.trim()) {
      setErrorMsg('Mohon isi nama kamu.');
      return;
    }
    if (!guestWa.trim() || guestWa.length < 8) {
      setErrorMsg('Mohon masukkan nomor WhatsApp yang valid.');
      return;
    }
    if (paymentMethod === 'QRIS' && !proofFile) {
      setErrorMsg('Wajib mengunggah bukti transfer untuk pembayaran QRIS.');
      return;
    }

    setSubmitting(true);
    let createdOrderId: string | null = null;
    try {
      // 1. Checkout
      const checkoutPayload = {
        guest_name: guestName.trim(),
        guest_wa: guestWa.trim(),
        payment_method: paymentMethod,
        items: items.map((i) => ({
          menu_id: i.menu_id,
          quantity: i.quantity,
          flavors: i.flavors,
          notes: i.notes,
        })),
      };

      const order = await api.checkout(checkoutPayload);
      createdOrderId = order.id;

      // 2. If QRIS, upload proof file
      if (paymentMethod === 'QRIS' && proofFile) {
        await api.uploadProof(order.id, proofFile);
      }

      // 3. Save guest profile & active order in localStorage
      try {
        localStorage.setItem(
          'display_canteen_guest',
          JSON.stringify({
            active_order_id: order.id,
            guest_name: guestName.trim(),
            guest_wa: guestWa.trim(),
          })
        );
      } catch {
        // ignore
      }

      // 4. Clear cart and redirect
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err: any) {
      if (createdOrderId) {
        // If order was created but proof upload had an issue, safely save order and proceed to order status
        try {
          localStorage.setItem(
            'display_canteen_guest',
            JSON.stringify({
              active_order_id: createdOrderId,
              guest_name: guestName.trim(),
              guest_wa: guestWa.trim(),
            })
          );
        } catch {
          // ignore
        }
        clearCart();
        navigate(`/orders/${createdOrderId}`);
      } else {
        setErrorMsg(err.message || 'Gagal memproses pesanan. Silakan coba lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] flex flex-col pb-12 shadow-lg">
      <Header showBack onBack={() => navigate('/')} title="Checkout Pesanan" />

      <main className="flex-1 px-4 pt-4 space-y-4">
        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Item Summary Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Ringkasan Pesanan ({items.length} Menu)
            </span>
            <span className="text-xs text-primary font-bold">
              Total Rp {totalAmount.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs">
                <div>
                  <span className="font-bold text-slate-800">
                    {item.quantity}x {item.name}
                  </span>
                  <p className="text-[11px] text-primary font-semibold mt-0.5">
                    Rasa: {item.flavors.join(' + ')}
                  </p>
                  {item.notes && (
                    <p className="text-[11px] text-slate-400 italic">"{item.notes}"</p>
                  )}
                </div>
                <span className="font-semibold text-slate-700">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Identification Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </span>
              <label className="text-sm font-bold text-slate-800">
                Informasi Pelanggan (Tanpa Login)
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nama Pemesan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Misal: Ahmad Rizky"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nomor WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={guestWa}
                  onChange={(e) => setGuestWa(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Kasir akan memberi tahu via WhatsApp jika roti sudah selesai dimasak.
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </span>
              <label className="text-sm font-bold text-slate-800">Pilih Metode Pembayaran</label>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('QRIS')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'QRIS'
                    ? 'border-primary bg-primary/5 text-primary font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
                <span className="text-xs">QRIS (Online)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'CASH'
                    ? 'border-primary bg-primary/5 text-primary font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">payments</span>
                <span className="text-xs">Tunai di Kasir</span>
              </button>
            </div>
          </div>

          {/* QRIS Flow */}
          {paymentMethod === 'QRIS' && (
            <>
              <QRISViewer totalAmount={totalAmount} />
              <ProofUpload
                selectedFile={proofFile}
                onFileSelect={setProofFile}
                isUploading={submitting}
              />
            </>
          )}

          {/* Cash Flow Notice */}
          {paymentMethod === 'CASH' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">info</span>
                Instruksi Pembayaran Tunai
              </p>
              <p className="text-[11px] leading-relaxed">
                Setelah menekan tombol di bawah, silakan langsung menuju kasir untuk melakukan pembayaran
                sebesar <strong>Rp {totalAmount.toLocaleString('id-ID')}</strong>. Roti akan mulai dipanggang
                setelah kasir menerima uang.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {paymentMethod === 'QRIS'
                  ? 'Mengunggah Bukti & Memproses...'
                  : 'Memproses Pesanan...'}
              </span>
            ) : (
              <span>Konfirmasi & Pesan Sekarang</span>
            )}
          </button>
        </form>
      </main>
    </div>
  );
};
