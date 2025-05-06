export interface CreateOrderDto {
  user_id?: string | number; // Will be set by the server from the JWT token
  game_id: number;
  currency_id: number;
  amount: number;
  price: number;
  payment_method: string;
  user_game_id: string;
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
