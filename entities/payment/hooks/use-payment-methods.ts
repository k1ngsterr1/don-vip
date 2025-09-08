import { useState, useEffect, useCallback } from "react";
import {
  PaymentMethodsApi,
  type PaymentMethod,
  type PaymentMethodsParams,
  type PaymentMethodsResponse,
  type UserPaymentMethodsResponse,
  type PaymentMethodsByCurrencyResponse,
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

export function useUserPaymentMethods() {
  const [userMethods, setUserMethods] =
    useState<UserPaymentMethodsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserMethods = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await PaymentMethodsApi.getPaymentMethodsForUser();
      setUserMethods(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load user payment methods";
      setError(errorMessage);
      console.error("Error fetching user payment methods:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserMethods();
  }, [fetchUserMethods]);

  const refetch = useCallback(() => {
    fetchUserMethods();
  }, [fetchUserMethods]);

  return {
    userMethods,
    isLoading,
    error,
    refetch,
  };
}

export function usePaymentMethodsByCurrency(currency?: string) {
  const [methodsByCurrency, setMethodsByCurrency] =
    useState<PaymentMethodsByCurrencyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMethodsByCurrency = useCallback(
    async (targetCurrency?: string) => {
      const currencyToFetch = targetCurrency || currency;

      console.log(
        "usePaymentMethodsByCurrency: Starting fetch with currency:",
        currencyToFetch
      );

      if (!currencyToFetch) {
        console.log(
          "usePaymentMethodsByCurrency: No currency provided, skipping fetch"
        );
        setError("Currency is required");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log(
          "usePaymentMethodsByCurrency: Making API call to /payment/methods/by-currency/" +
            currencyToFetch
        );
        const response = await PaymentMethodsApi.getPaymentMethodsByCurrency(
          currencyToFetch
        );
        console.log("usePaymentMethodsByCurrency: API response:", response);
        setMethodsByCurrency(response);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load payment methods by currency";
        setError(errorMessage);
        console.error("Error fetching payment methods by currency:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [currency]
  );

  useEffect(() => {
    console.log(
      "usePaymentMethodsByCurrency: useEffect triggered with currency:",
      currency
    );
    if (currency) {
      console.log(
        "usePaymentMethodsByCurrency: Currency is valid, calling fetchMethodsByCurrency"
      );
      fetchMethodsByCurrency();
    }
    // Remove the else block that resets state when currency is undefined
    // This allows the hook to work properly during SSR/hydration
  }, [fetchMethodsByCurrency]);

  const refetch = useCallback(
    (newCurrency?: string) => {
      fetchMethodsByCurrency(newCurrency);
    },
    [fetchMethodsByCurrency]
  );

  return {
    methodsByCurrency,
    isLoading,
    error,
    refetch,
  };
}
