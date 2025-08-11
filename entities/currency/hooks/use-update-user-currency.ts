import { useState } from "react";
import type {
  UpdateCurrencyDto,
  UpdateCurrencyResponse,
} from "@/entities/currency/model/api-types";
import { CurrencyApi } from "@/entities/currency/api/currency-user-api";

export function useUpdateUserCurrency() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCurrency = async (
    currencyData: UpdateCurrencyDto
  ): Promise<UpdateCurrencyResponse | null> => {
    setIsUpdating(true);
    setError(null);

    try {
      const result = await CurrencyApi.updateUserCurrency(currencyData);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update currency";
      setError(errorMessage);
      console.error("Error updating user currency:", err);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  const getUserCurrency = async () => {
    try {
      const result = await CurrencyApi.getUserCurrency();
      return result;
    } catch (err) {
      console.error("Error getting user currency:", err);
      return null;
    }
  };

  return {
    updateCurrency,
    getUserCurrency,
    isUpdating,
    error,
  };
}
