export interface CreateOrderDto {
  user_id?: string | number; // Will be set by the server from the JWT token
  game_id: number; // Maps to product_id in API
  currency_id: number; // Maps to item_id in API
  amount: number;
  price: number | string;
  payment_method: string; // Maps to payment in API
  user_game_id: string; // Maps to account_id in API
  server_id?: string;
}

export interface Order {
  id: number;
  user_id: number;
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
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
