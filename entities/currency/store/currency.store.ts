"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency } from "../model/currency-types";

const DEFAULT_CURRENCY: Currency = {
  code: "RUB",
  name: "Российский рубль",
  symbol: "₽",
  flag: "🇷🇺",
  rate: 1,
};

// Utility functions outside of store to keep them stable
export const convertPrice = (
  price: number,
  fromCurrency: Currency | undefined,
  toCurrency: Currency
): number => {
  const from = fromCurrency || DEFAULT_CURRENCY;

  if (from.code === toCurrency.code) {
    return price;
  }

  // Convert from source currency to RUB, then to target currency
  const priceInRub = price / from.rate;
  const convertedPrice = priceInRub * toCurrency.rate;

  return Math.round(convertedPrice * 100) / 100;
};

export const formatPrice = (
  price: number,
  fromCurrency: Currency | undefined,
  toCurrency: Currency
): string => {
  const convertedPrice = convertPrice(price, fromCurrency, toCurrency);
  return `${convertedPrice.toFixed(2)} ${toCurrency.symbol}`;
};

// Basic currencies available immediately (with more accurate approximate rates)
const BASIC_CURRENCIES: Currency[] = [
  DEFAULT_CURRENCY,
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    flag: "🇺🇸",
    rate: 0.011,
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    rate: 0.01,
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    rate: 0.009,
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    symbol: "¥",
    flag: "🇨🇳",
    rate: 0.079,
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    flag: "🇯🇵",
    rate: 1.62,
  },
  {
    code: "KRW",
    name: "South Korean Won",
    symbol: "₩",
    flag: "🇰🇷",
    rate: 14.5,
  },
  {
    code: "BRL",
    name: "Brazilian Real",
    symbol: "R$",
    flag: "🇧🇷",
    rate: 0.056,
  },
  {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    flag: "🇮🇳",
    rate: 0.92,
  },
  {
    code: "TRY",
    name: "Turkish Lira",
    symbol: "₺",
    flag: "🇹🇷",
    rate: 0.37,
  },
];

interface CurrencyState {
  selectedCurrency: Currency;
  availableCurrencies: Currency[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  setCurrency: (currency: Currency) => void;
  setAvailableCurrencies: (currencies: Currency[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadCurrencies: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      selectedCurrency: DEFAULT_CURRENCY,
      availableCurrencies: BASIC_CURRENCIES,
      isLoading: false,
      error: null,
      isInitialized: false,

      setCurrency: (currency: Currency) => {
        set({ selectedCurrency: currency, error: null });
      },

      setAvailableCurrencies: (currencies: Currency[]) => {
        set({ availableCurrencies: currencies });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      loadCurrencies: async () => {
        const { isInitialized } = get();

        // Don't load if already initialized
        if (isInitialized) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // Dynamic import to avoid SSR issues
          const { currencyApi } = await import("../api/currency-api");
          const currencies = await currencyApi.getCBRRates();
          set({
            availableCurrencies: currencies,
            isInitialized: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to load currencies:", error);
          set({
            error: "Failed to load currencies",
            isLoading: false,
            isInitialized: true, // Mark as initialized even on error to prevent retries
          });
        }
      },
    }),
    {
      name: "currency-storage", // unique name
      partialize: (state) => ({
        selectedCurrency: state.selectedCurrency,
        availableCurrencies: state.availableCurrencies,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
