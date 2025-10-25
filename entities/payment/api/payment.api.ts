import { apiClient } from "@/shared/config/apiClient";
import {
  PagsmileCreatePayinDto,
  PagsmilePayinResponse,
  DonatBankBalanceDto,
  DonatBankBalanceResponse,
  PagsmileCheckoutDto,
  PagsmileCheckoutResponse,
  MonetaCreatePayinDto,
  MonetaPayinResponse,
  DukPayCreatePayinDto,
  DukPayPayinResponse,
  Pay4GameCreatePaymentDto,
  Pay4GamePaymentResponse,
} from "../model/types";

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

  /**
   * Create a new checkout via Pagsmile (for non-RUB currencies)
   */
  createPagsmileCheckout: async (
    data: PagsmileCheckoutDto
  ): Promise<PagsmileCheckoutResponse> => {
    const response = await apiClient.post<PagsmileCheckoutResponse>(
      "/payment/pagsmile/checkout",
      data
    );
    return response.data;
  },

  /**
   * Create a new balance request via DonatBank
   */
  createDonatBankBalance: async (
    data: DonatBankBalanceDto
  ): Promise<DonatBankBalanceResponse> => {
    const response = await apiClient.post<DonatBankBalanceResponse>(
      "/payment/donatbank/balance",
      data
    );
    return response.data;
  },

  /**
   * Create a new payment via Moneta
   */
  createMonetaPayin: async (
    data: MonetaCreatePayinDto
  ): Promise<MonetaPayinResponse> => {
    const response = await apiClient.post<MonetaPayinResponse>(
      "/payment/moneta/payin",
      data
    );
    return response.data;
  },

  /**
   * Create a new payment via DukPay
   */
  createDukPayPayin: async (
    data: DukPayCreatePayinDto
  ): Promise<DukPayPayinResponse> => {
    const response = await apiClient.post<DukPayPayinResponse>(
      "/payment/dukpay/payin",
      data
    );
    return response.data;
  },

  /**
   * Create a new payment via Pay4Game
   */
  createPay4GamePayment: async (
    data: Pay4GameCreatePaymentDto
  ): Promise<Pay4GamePaymentResponse> => {
    const response = await apiClient.post<Pay4GamePaymentResponse>(
      "/payment/pay4game/create",
      data
    );
    return response.data;
  },
};
