import { apiClient } from "@/shared/config/apiClient";
import { PagsmileCreatePayinDto, PagsmilePayinResponse } from "../model/types";

/**
 * Payment API client for payment-related operations
 */
export const paymentApi = {
  /**
   * Create a new payment via Pagsmile
   */
  createPagsmilePayin: async (
    data: PagsmileCreatePayinDto
  ): Promise<PagsmilePayinResponse> => {
    const response = await apiClient.post<PagsmilePayinResponse>(
      "/payment/pagsmile/payin",
      data
    );
    return response.data;
  },
};
