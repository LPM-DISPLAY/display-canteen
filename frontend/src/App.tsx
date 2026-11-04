import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { MenuPage } from './pages/MenuPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { StatusPage } from './pages/StatusPage';
import { AdminKanban } from './pages/AdminKanban';
import { AdminReports } from './pages/AdminReports';

export const App: React.FC = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer Ordering Routes */}
          <Route path="/" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/:id" element={<StatusPage />} />

          {/* Admin PIC Management Routes */}
          <Route path="/admin" element={<AdminKanban />} />
          <Route path="/admin/reports" element={<AdminReports />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
