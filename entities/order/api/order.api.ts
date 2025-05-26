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
  createOrder: async (data: CreateOrderDto): Promise<Order> => {
    // Get userId from auth store or localStorage
    const userId = await getUserId();

    const orderData = {
      ...data,
      user_id: userId,
    };

    const response = await apiClient.post<Order>("/order", orderData);
    return response.data;
  },

  /**
   * Get all orders with pagination
   */
  getOrders: async (page = 1, limit = 10): Promise<OrdersResponse> => {
    // Get userId from auth store or localStorage
    let userId: string | null = null;

    // Try to get userId from auth store first
    const authUser = useAuthStore.getState().user;
    if (authUser && authUser.id) {
      userId = authUser.id.toString();
    }
    // If no authenticated user, try to get from localStorage (for guest users)
    else if (typeof window !== "undefined") {
      userId = localStorage.getItem("userId");
    }

    // Include userId in query params if available
    const userParam = userId ? `&user_id=${userId}` : "";
    const response = await apiClient.get<OrdersResponse>(
      `/order?page=${page}&limit=${limit}${userParam}`
    );
    return response.data;
  },

  /**
   * Get order history for authenticated user
   */
  /**
   * Get order history for current user (authenticated or guest)
   */
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
      // Guest user flow: call guest history endpoint with userId
      const response = await apiClient.get<OrdersResponse>(
        `/order/guest/history?userId=${guestParams.userId}&page=${page}&limit=${limit}`
      );
      return response.data;
    }

    // Authenticated user flow: only use pagination, userId is taken from JWT
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
