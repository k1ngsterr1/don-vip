// API functions for user currency management
import type {
  UpdateCurrencyDto,
  UpdateCurrencyResponse,
} from "@/entities/currency/model/api-types";
import { apiClient, extractErrorMessage } from "@/shared/config/apiClient";

export class CurrencyApi {
  /**
   * Обновить валюту пользователя
   * PATCH /api/user/currency
   */
  static async updateUserCurrency(
    data: UpdateCurrencyDto
  ): Promise<UpdateCurrencyResponse> {
    try {
      const response = await apiClient.patch<UpdateCurrencyResponse>(
        "/user/currency",
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }

  /**
   * Получить текущую валюту пользователя
   * GET /api/user/profile
   */
  static async getUserCurrency(): Promise<{
    preferred_currency: string;
    country_code: string;
  }> {
    try {
      const response = await apiClient.get<{
        preferred_currency: string;
        country_code: string;
      }>("/user/profile");
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }
}
