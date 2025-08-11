import { useState } from "react";
import type {
  UpdateCurrencyDto,
  UpdateCurrencyResponse,
} from "@/entities/currency/model/api-types";

export function useUpdateUserCurrency() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCurrency = async (
    currencyData: UpdateCurrencyDto
  ): Promise<UpdateCurrencyResponse | null> => {
    setIsUpdating(true);
    setError(null);

    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch("/api/user/currency", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currencyData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result: UpdateCurrencyResponse = await response.json();
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

  return {
    updateCurrency,
    isUpdating,
    error,
  };
}
