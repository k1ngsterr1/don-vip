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
  setCurrency: (currency: Currency) => void;
  setAvailableCurrencies: (currencies: Currency[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  convertPrice: (price: number, fromCurrency?: Currency) => number;
  formatPrice: (price: number, fromCurrency?: Currency) => string;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      selectedCurrency: DEFAULT_CURRENCY,
      availableCurrencies: BASIC_CURRENCIES,
      isLoading: false,
      error: null,

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

      convertPrice: (price: number, fromCurrency?: Currency) => {
        const { selectedCurrency } = get();
        const from = fromCurrency || DEFAULT_CURRENCY;

        if (from.code === selectedCurrency.code) {
          return price;
        }

        // Convert from source currency to RUB, then to target currency
        const priceInRub = price / from.rate;
        const convertedPrice = priceInRub * selectedCurrency.rate;

        return Math.round(convertedPrice * 100) / 100;
      },

      formatPrice: (price: number, fromCurrency?: Currency) => {
        const { selectedCurrency, convertPrice } = get();
        const convertedPrice = convertPrice(price, fromCurrency);

        return `${convertedPrice.toFixed(2)} ${selectedCurrency.symbol}`;
      },
    }),
    {
      name: "currency-storage", // unique name
      partialize: (state) => ({
        selectedCurrency: state.selectedCurrency,
        availableCurrencies: state.availableCurrencies,
      }),
    }
  )
);
