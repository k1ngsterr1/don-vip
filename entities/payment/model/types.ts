export interface PagsmileCheckoutDto {
  order_id: string;
  amount: number | string;
  currency: string;
  region: string;
  customer: {
    name: string;
    email: string;
  };
}

export interface PagsmileCheckoutResponse {
  success: boolean;
  data?: {
    checkout_url: string;
    payment_id: string;
  };
  error?: string;
}

export interface PagsmileCreatePayinDto {
  amount: string;
  order_id: number;
  user_id?: number;
  name?: string;
  currency?: string;
  region?: string;
}

export interface PagsmilePayinResponse {
  id: string;
  status: string;
  redirect_url: string;
  created_at: string;
  out_trade_no: string;
  expires_at: string;
  order_id: string | number;
  amount: number | string;
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

export interface DonatBankBalanceDto {
  amount: number;
}

export interface DonatBankBalanceResponse {
  id: string;
  status: string;
  paymentUrl: string;
  amount: number;
  created_at: string;
}

export type PaymentMethod = "card" | "tbank" | "qiwi" | "donatbank";

export const PAYMENT_METHOD_MAPPING: Record<string, string> = {
  card: "credit_card",
  tbank: "bank_transfer",
  qiwi: "qiwi_wallet",
  donatbank: "donatbank",
};
