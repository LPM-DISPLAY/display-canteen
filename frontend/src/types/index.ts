export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'VERIFYING_PAYMENT'
  | 'PROCESSING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentMethod = 'CASH' | 'QRIS';

export type FlavorVariant =
  | 'Cokelat'
  | 'Keju'
  | 'Strawberry'
  | 'Blueberry'
  | 'Tiramisu'
  | 'Green Tea';

export interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  image_url?: string | null;
  prep_time_minutes: number;
  is_available: boolean;
}

export interface OrderItem {
  id: string;
  menu_id: string;
  item_name: string;
  selected_flavors: string;
  item_price: number;
  quantity: number;
  subtotal: number;
  notes?: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  guest_name: string;
  guest_wa: string;
  payment_method: PaymentMethod;
  payment_proof_url?: string | null;
  status: OrderStatus;
  total_amount: number;
  estimated_ready_at?: string | null;
  created_at: string;
  items: OrderItem[];
  wa_notify_url?: string | null;
}

export interface CartItem {
  menu_id: string;
  name: string;
  flavors: FlavorVariant[];
  price: number;
  quantity: number;
  notes?: string;
}

export interface CheckoutPayload {
  guest_name: string;
  guest_wa: string;
  payment_method: PaymentMethod;
  items: {
    menu_id: string;
    quantity: number;
    flavors: string[];
    notes?: string;
  }[];
}

export interface DashboardMetrics {
  total_revenue: number;
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
  payment_breakdown: {
    cash: number;
    qris: number;
  };
}

export interface PublicQueueItem {
  id: string;
  order_number: string;
  guest_name: string;
  status: OrderStatus;
  estimated_ready_at?: string | null;
  created_at: string;
}

export interface PublicQueueResponse {
  processing: PublicQueueItem[];
  ready: PublicQueueItem[];
  server_time_wib: string;
}
