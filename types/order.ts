export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  guest_email?: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal_cents: number;
  tax_cents: number;
  shipping_cents: number;
  total_cents: number;
  shipping_address: any;
  billing_address?: any;
  payment_method: 'card' | 'paypal' | 'bank_transfer' | 'cod';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  placed_at: string;
  shipped_at?: string;
  delivered_at?: string;
  order_items: OrderItem[];
  order_tracking: OrderTracking[];
  users?: User;
}

export interface OrderItem {
  id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price_cents: number;
  total_price_cents: number;
}

export interface OrderTracking {
  id: string;
  status: 'OrderConfirmed' | 'DesignInProgress' | 'InReview' | 'DesignApproved' | 'InProduction' | 'QualityCheck' | 'Packaging' | 'Shipped' | 'Delivered' | 'Completed';
  location?: string;
  description?: string;
  tracking_number?: string;
  carrier?: string;
  tracked_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}