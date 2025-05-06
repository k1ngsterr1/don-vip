export interface PagsmileCreatePayinDto {
  order_id: string | number;
  amount: number;
  currency: string;
  country: string;
  payment_method: string;
  user_id?: number; // Will be set by the server from JWT token
  notification_url?: string;
  return_url?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  billing_address?: {
    street?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
  };
  description?: string;
  metadata?: Record<string, any>;
}

export interface PagsmilePayinResponse {
  id: string;
  status: string;
  redirect_url: string;
  created_at: string;
  expires_at: string;
  order_id: string | number;
  amount: number;
  currency: string;
  web_url: string;
  payment_method: string;
}

export interface PagsmileNotificationDto {
  id: string;
  type: string;
  data: {
    id: string;
    status: string;
    order_id: string | number;
    amount: number;
    currency: string;
    payment_method: string;
    created_at: string;
    updated_at: string;
  };
}

export type PaymentMethod = "card" | "tbank" | "qiwi";

export const PAYMENT_METHOD_MAPPING: Record<string, string> = {
  card: "credit_card",
  tbank: "bank_transfer",
  qiwi: "qiwi_wallet",
};
