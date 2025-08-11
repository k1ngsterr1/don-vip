import { useState, useEffect, useCallback } from "react";
import {
  PaymentMethodsApi,
  type PaymentMethod,
  type PaymentMethodsParams,
  type PaymentMethodsResponse,
} from "@/entities/payment/api/payment-methods-api";

export function usePaymentMethods(params: PaymentMethodsParams = {}) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [recommendedMethods, setRecommendedMethods] = useState<PaymentMethod[]>(
    []
  );
  const [fallbackMethods, setFallbackMethods] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState<{
    currency: string;
    country: string | null;
    region: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentMethods = useCallback(
    async (newParams?: PaymentMethodsParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const finalParams = { ...params, ...newParams };
        const response: PaymentMethodsResponse =
          await PaymentMethodsApi.getPaymentMethods(finalParams);

        // Set all payment methods from pagsmile
        setPaymentMethods(response.methods.pagsmile);
        setRecommendedMethods(response.methods.recommended);
        setFallbackMethods(response.methods.fallback);
        setUserInfo(response.user);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load payment methods";
        setError(errorMessage);
        console.error("Error fetching payment methods:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [params.currency, params.region, params.amount, params.product_type]
  );

  // Загружаем методы платежа при монтировании компонента или изменении параметров
  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const refetch = useCallback(
    (newParams?: PaymentMethodsParams) => {
      fetchPaymentMethods(newParams);
    },
    [fetchPaymentMethods]
  );

  return {
    paymentMethods,
    recommendedMethods,
    fallbackMethods,
    userInfo,
    isLoading,
    error,
    refetch,
  };
}

export function usePaymentMethodAvailability() {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = async (
    methodId: string,
    params: PaymentMethodsParams = {}
  ): Promise<{ available: boolean; reason?: string } | null> => {
    setIsChecking(true);
    setError(null);

    try {
      const result = await PaymentMethodsApi.checkPaymentMethodAvailability(
        methodId,
        params
      );
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to check availability";
      setError(errorMessage);
      console.error("Error checking payment method availability:", err);
      return null;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkAvailability,
    isChecking,
    error,
  };
}
