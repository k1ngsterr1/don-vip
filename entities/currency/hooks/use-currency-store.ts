"use client";

import { useCallback, useEffect } from "react";
import {
  useCurrencyStore,
  convertPrice,
  formatPrice,
} from "../store/currency.store";
import type { Currency } from "../model/currency-types";

export const useCurrency = () => {
  const {
    selectedCurrency,
    availableCurrencies,
    isLoading,
    error,
    isInitialized,
    setCurrency,
    loadCurrencies,
  } = useCurrencyStore();

  // Initialize currencies on first mount - loadCurrencies is stable from Zustand
  useEffect(() => {
    loadCurrencies();
  }, []); // Empty dependency - loadCurrencies from Zustand is stable

  const updateCurrency = async (currency: Currency) => {
    try {
      setCurrency(currency);
      // Currency preference is automatically persisted through Zustand persistence
    } catch (error) {
      console.error("Failed to update currency:", error);
    }
  };

  // Create stable functions that use current selectedCurrency
  const convertPriceWithCurrent = useCallback(
    (price: number, fromCurrency?: Currency) => {
      return convertPrice(price, fromCurrency, selectedCurrency);
    },
    [selectedCurrency]
  );

  const formatPriceWithCurrent = useCallback(
    (price: number, fromCurrency?: Currency) => {
      return formatPrice(price, fromCurrency, selectedCurrency);
    },
    [selectedCurrency]
  );

  return {
    selectedCurrency,
    availableCurrencies,
    isLoading,
    error,
    isInitialized,
    updateCurrency,
    convertPrice: convertPriceWithCurrent,
    formatPrice: formatPriceWithCurrent,
    // Alias for backward compatibility
    setCurrency: updateCurrency,
  };
};
