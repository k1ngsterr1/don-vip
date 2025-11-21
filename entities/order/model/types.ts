export interface CreateOrderDto {
  identifier?: string;
  user_id?: string | number;
  game_id: number;
  currency_id: number; // -1 для кастомных заказов
  amount: number;
  price: number | string;
  payment_method: string;
  user_game_id: string;
  coupon_code: string;
  server_id?: string;

  // Pricing information with discounts
  original_price?: number;
  package_discount?: number;
  telegram_discount?: number;
  has_telegram_discount?: boolean; // Флаг что применена скидка из Telegram
  referral_discount?: number;
  coupon_discount?: number;
  payment_method_fee?: number; // Fee percentage (e.g., 2 for 2%)
  payment_method_fee_amount?: number; // Fee amount in base currency
  final_price?: number;
  currency?: string;
}

export interface Order {
  id: number;
  user_id: number;
  items: any[];
  game_id: number;
  currency_id: number;
  amount: number;
  price: number;
  payment_method: string;
  user_game_id: string;
  server_id?: string;
  status: "pending" | "completed" | "failed";
  created_at: string;
  updated_at: string;

  // Pricing information with discounts
  original_price?: number;
  package_discount?: number;
  telegram_discount?: number;
  has_telegram_discount?: boolean; // Флаг что применена скидка из Telegram
  referral_discount?: number;
  coupon_discount?: number;
  final_price?: number;
  currency?: string;
}

export interface OrdersResponse {
  data: Order[];
  orders: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
