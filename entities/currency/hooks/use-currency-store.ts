"use client";

import { useEffect } from "react";
import { useCurrencyStore } from "../store/currency.store";
import { currencyApi } from "../api/currency-api";
import { CurrencyApi } from "../api/currency-user-api";
import type { Currency } from "../model/currency-types";

export const useCurrency = () => {
  const {
    selectedCurrency,
    availableCurrencies,
    isLoading,
    error,
    setCurrency,
    setAvailableCurrencies,
    setLoading,
    setError,
    convertPrice,
    formatPrice,
  } = useCurrencyStore();

  // Load currencies from API on mount
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        setLoading(true);
        const currencies = await currencyApi.getCBRRates();
        if (currencies && currencies.length > 0) {
          setAvailableCurrencies(currencies);
        }
      } catch (error) {
        console.error("Failed to load currencies:", error);
        setError("Failed to load currencies");
      } finally {
        setLoading(false);
      }
    };

    loadCurrencies();
  }, [setAvailableCurrencies, setLoading, setError]);

  const updateCurrency = async (currency: Currency) => {
    try {
      setCurrency(currency);

      // Optionally update on backend if user is authenticated
      // This is fire-and-forget, no need to wait
      CurrencyApi.updateUserCurrency({
        preferred_currency: currency.code,
      }).catch((err: any) => {
        console.warn("Failed to update user currency on backend:", err);
      });
    } catch (error) {
      console.error("Failed to update currency:", error);
      setError("Failed to update currency");
    }
  };

  return {
    selectedCurrency,
    availableCurrencies,
    isLoading,
    error,
    updateCurrency,
    convertPrice,
    formatPrice,
    // Alias for backward compatibility
    setCurrency: updateCurrency,
  };
};
