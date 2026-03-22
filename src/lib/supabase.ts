import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Safe client — won't crash if env vars are missing during build
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder"
);

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

export interface DbProduct {
  id: string;
  name: string;
  category: "Men" | "Women" | "Kids";
  price: number;
  mrp: number;
  description: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export interface DbOrder {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  total_amount: number;
  delivery_address: DeliveryAddress;
  payment_status: "pending" | "paid" | "failed";
  payment_id: string | null;
  order_status: "placed" | "ordered_from_vendor" | "shipped" | "delivered";
  tracking_number: string | null;
  tracking_notified: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  color: string;
  color_hex: string;
  size: string;
  qty: number;
  price: number;
  image_url: string;
}

export interface DeliveryAddress {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface DbCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}
