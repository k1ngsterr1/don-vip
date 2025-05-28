import { apiClient } from "@/shared/config/apiClient";
import type { CreateOrderDto, Order, OrdersResponse } from "../model/types";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { getUserId } from "@/shared/hooks/use-get-user-id";

/**
 * Order API client for order-related operations
 */
export const orderApi = {
  /**
   * Create a new order
   */
  createOrder: async (data: any): Promise<Order> => {
    console.log("📤 API: Sending order data:", data); // Debug log to see what's being sent

    const response = await apiClient.post<Order>("/order", data);

    console.log("📥 API: Received response:", response.data); // Debug log

    return response.data;
  },

  /**
   * Get all orders with pagination
   */
  getOrders: async (page = 1, limit = 10): Promise<OrdersResponse> => {
    const userId = getUserId();
    const userParam = userId ? `&user_id=${userId}` : "";

    const response = await apiClient.get<OrdersResponse>(
      `/order?page=${page}&limit=${limit}${userParam}`
    );
    return response.data;
  },

  /**
   * Get order history for current user (authenticated or guest)
   */
  getOrderHistory: async (
    page = 1,
    limit = 10,
    guestParams?: { userId: string }
  ): Promise<OrdersResponse> => {
    const isGuestAuth = useAuthStore.getState().isGuestAuth;

    if (isGuestAuth) {
      if (!guestParams?.userId) {
        throw new Error("userId is required for guest order history");
      }
      const response = await apiClient.get<OrdersResponse>(
        `/order/guest/history?userId=${guestParams.userId}&page=${page}&limit=${limit}`
      );
      return response.data;
    }

    const response = await apiClient.get<OrdersResponse>(
      `/order/history?page=${page}&limit=${limit}`
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
