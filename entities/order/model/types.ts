export interface CreateOrderDto {
  identifier?: string;
  user_id?: string | number;
  game_id: number;
  currency_id: number;
  amount: number;
  price: number | string;
  payment_method: string;
  user_game_id: string;
  coupon_code: string;
  server_id?: string;
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
