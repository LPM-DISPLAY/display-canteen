import {
  MenuItem,
  Order,
  CheckoutPayload,
  OrderStatus,
  DashboardMetrics,
  PublicQueueResponse,
} from '../types';

const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  let text = '';
  try {
    text = await res.text();
  } catch {
    // If stream reading fails entirely
  }

  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    let errorDetail = 'Terjadi kesalahan sistem';
    if (data && typeof data === 'object' && data.detail) {
      errorDetail = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
    } else if (typeof data === 'string' && data) {
      errorDetail = data;
    }
    throw new ApiError(errorDetail, res.status);
  }

  return data as T;
}

export const api = {
  // Menus
  async getMenus(all = false): Promise<MenuItem[]> {
    const res = await fetch(`${API_BASE}/menus?all=${all}`);
    return handleResponse<MenuItem[]>(res);
  },

  async createMenu(menu: Partial<MenuItem>, adminSecret: string): Promise<MenuItem> {
    const res = await fetch(`${API_BASE}/menus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Secret': adminSecret,
      },
      body: JSON.stringify(menu),
    });
    return handleResponse<MenuItem>(res);
  },

  async updateMenu(id: string, menu: Partial<MenuItem>, adminSecret: string): Promise<MenuItem> {
    const res = await fetch(`${API_BASE}/menus/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Secret': adminSecret,
      },
      body: JSON.stringify(menu),
    });
    return handleResponse<MenuItem>(res);
  },

  async deleteMenu(id: string, adminSecret: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/menus/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Admin-Secret': adminSecret,
      },
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Orders
  async checkout(payload: CheckoutPayload): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<Order>(res);
  },

  async getOrder(id: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    return handleResponse<Order>(res);
  },

  async cancelOrder(orderId: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
      method: 'POST',
    });
    return handleResponse<Order>(res);
  },

  async getPublicQueue(): Promise<PublicQueueResponse> {
    const res = await fetch(`${API_BASE}/orders/queue`);
    return handleResponse<PublicQueueResponse>(res);
  },

  async uploadProof(orderId: string, file: File): Promise<Order> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/orders/${orderId}/upload-proof`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<Order>(res);
  },

  async getOrders(status?: string, adminSecret?: string): Promise<Order[]> {
    const url = status ? `${API_BASE}/orders?status=${status}` : `${API_BASE}/orders`;
    const res = await fetch(url, {
      headers: adminSecret ? { 'X-Admin-Secret': adminSecret } : {},
    });
    return handleResponse<Order[]>(res);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, adminSecret: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Secret': adminSecret,
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse<Order>(res);
  },

  // Reports
  async getDashboardMetrics(adminSecret: string): Promise<DashboardMetrics> {
    const res = await fetch(`${API_BASE}/reports/dashboard`, {
      headers: { 'X-Admin-Secret': adminSecret },
    });
    return handleResponse<DashboardMetrics>(res);
  },

  getExportUrl(adminSecret: string): string {
    return `${API_BASE}/reports/export?secret=${encodeURIComponent(adminSecret)}`;
  },
};
