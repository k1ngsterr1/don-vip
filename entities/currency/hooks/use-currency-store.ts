"use client";

import { useEffect, useRef } from "react";
import { useCurrencyStore } from "../store/currency.store";
import { currencyApi } from "../api/currency-api";
import { CurrencyApi } from "../api/currency-user-api";
import type { Currency } from "../model/currency-types";

export const useCurrency = () => {
  const loadedRef = useRef(false);
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

  // Load currencies from API on mount (only once)
  useEffect(() => {
    const loadCurrencies = async () => {
      if (loadedRef.current) return; // Prevent multiple loads

      try {
        loadedRef.current = true; // Set early to prevent race conditions
        setLoading(true);
        const currencies = await currencyApi.getCBRRates();
        if (currencies && currencies.length > 0) {
          setAvailableCurrencies(currencies);
        }
      } catch (error) {
        console.error("Failed to load currencies:", error);
        setError("Failed to load currencies");
        loadedRef.current = false; // Reset on error to allow retry
      } finally {
        setLoading(false);
      }
    };

    loadCurrencies();
  }, []); // Empty dependency array - run only once on mount

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
