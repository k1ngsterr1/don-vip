import { apiClient } from "@/shared/config/apiClient";
import { CreateOrderDto, Order, OrdersResponse } from "../model/types";

/**
 * Order API client for order-related operations
 */
export const orderApi = {
  /**
   * Create a new order
   */
  createOrder: async (data: CreateOrderDto): Promise<Order> => {
    const response = await apiClient.post<Order>("/order", data);
    return response.data;
  },

  /**
   * Get all orders with pagination
   */
  getOrders: async (page = 1, limit = 10): Promise<OrdersResponse> => {
    const response = await apiClient.get<OrdersResponse>(
      `/order?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Get a specific order by ID
   */
  getOrderById: async (orderId: string | number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/order/${orderId}`);
    return response.data;
  },

  /**
   * Delete an order
   */
  deleteOrder: async (orderId: string | number): Promise<void> => {
    await apiClient.delete(`/order/${orderId}`);
  },
};
