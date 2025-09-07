// API functions for payment methods management
import { apiClient, extractErrorMessage } from "@/shared/config/apiClient";

export interface PaymentMethod {
  id: string;
  name: string;
  type: "card" | "wallet" | "crypto" | "bank" | "other";
  currency: string;
  region: string;
  processing_fee?: string;
  icon?: string;
  enabled?: boolean;
  supported_currencies?: string[];
  supported_regions?: string[];
  min_amount?: number;
  max_amount?: number;
  processing_time?: string;
}

export interface PaymentMethodsResponse {
  user: {
    currency: string;
    country: string | null;
    region: string;
  };
  methods: {
    pagsmile: PaymentMethod[];
    fallback: string[];
    recommended: PaymentMethod[];
  };
}

export interface PaymentMethodsParams {
  currency?: string;
  region?: string;
  amount?: number;
  product_type?: string;
}

export interface UserPaymentMethodsResponse {
  currency: string;
  country: string;
  region: string;
  methods: string[];
  supported_currencies: string[];
}

export class PaymentMethodsApi {
  /**
   * Получить доступные методы платежа для региона/валюты
   * GET /api/payment/methods
   */
  static async getPaymentMethods(
    params: PaymentMethodsParams = {}
  ): Promise<PaymentMethodsResponse> {
    try {
      const response = await apiClient.get<PaymentMethodsResponse>(
        "/payment/methods",
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }

  /**
   * Получить конкретный метод платежа
   * GET /api/payment/methods/:id
   */
  static async getPaymentMethod(id: string): Promise<PaymentMethod> {
    try {
      const response = await apiClient.get<PaymentMethod>(
        `/payment/methods/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }

  /**
   * Проверить доступность метода платежа
   * GET /api/payment/methods/:id/availability
   */
  static async checkPaymentMethodAvailability(
    id: string,
    params: PaymentMethodsParams = {}
  ): Promise<{ available: boolean; reason?: string }> {
    try {
      const response = await apiClient.get<{
        available: boolean;
        reason?: string;
      }>(`/payment/methods/${id}/availability`, { params });
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }

  /**
   * Получить доступные методы платежа для текущего пользователя на основе его валюты
   * GET /api/payment/methods-for-user
   * Requires authentication
   */
  static async getPaymentMethodsForUser(): Promise<UserPaymentMethodsResponse> {
    try {
      const response = await apiClient.get<UserPaymentMethodsResponse>(
        "/payment/methods-for-user"
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }
}
