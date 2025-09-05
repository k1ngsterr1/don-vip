"use client";

import { useState, useEffect } from "react";
import { currencyApi } from "../api/currency-api";
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
    rate: 0.011, // 1 RUB = 0.011 USD (more accurate)
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    rate: 0.01, // 1 RUB = 0.010 EUR (more accurate)
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    rate: 0.009, // 1 RUB = 0.009 GBP (more accurate)
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    symbol: "¥",
    flag: "🇨🇳",
    rate: 0.079, // 1 RUB = 0.079 CNY (more accurate)
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    flag: "🇯🇵",
    rate: 1.65, // 1 RUB = 1.65 JPY (more accurate)
  },
  // Add more popular currencies with accurate rates
  {
    code: "KRW",
    name: "South Korean Won",
    symbol: "₩",
    flag: "🇰🇷",
    rate: 14.5, // 1 RUB = 14.5 KRW
  },
  {
    code: "SGD",
    name: "Singapore Dollar",
    symbol: "S$",
    flag: "🇸🇬",
    rate: 0.015, // 1 RUB = 0.015 SGD
  },
  {
    code: "THB",
    name: "Thai Baht",
    symbol: "฿",
    flag: "🇹🇭",
    rate: 0.4, // 1 RUB = 0.40 THB
  },
  {
    code: "MYR",
    name: "Malaysian Ringgit",
    symbol: "RM",
    flag: "🇲🇾",
    rate: 0.05, // 1 RUB = 0.050 MYR
  },
  {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    flag: "🇮🇳",
    rate: 0.91, // 1 RUB = 0.91 INR
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    flag: "🇦🇺",
    rate: 0.017, // 1 RUB = 0.017 AUD
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    flag: "🇨🇦",
    rate: 0.015, // 1 RUB = 0.015 CAD
  },
  {
    code: "CZK",
    name: "Czech Koruna",
    symbol: "Kč",
    flag: "🇨🇿",
    rate: 0.25, // 1 RUB = 0.25 CZK
  },
  {
    code: "PLN",
    name: "Polish Zloty",
    symbol: "zł",
    flag: "🇵🇱",
    rate: 0.044, // 1 RUB = 0.044 PLN
  },
  {
    code: "SEK",
    name: "Swedish Krona",
    symbol: "kr",
    flag: "🇸🇪",
    rate: 0.11, // 1 RUB = 0.11 SEK
  },
  {
    code: "NOK",
    name: "Norwegian Krone",
    symbol: "kr",
    flag: "🇳🇴",
    rate: 0.11, // 1 RUB = 0.11 NOK
  },
  {
    code: "DKK",
    name: "Danish Krone",
    symbol: "kr",
    flag: "🇩🇰",
    rate: 0.075, // 1 RUB = 0.075 DKK
  },
  // Additional European currencies
  {
    code: "HRK",
    name: "Croatian Kuna",
    symbol: "kn",
    flag: "🇭🇷",
    rate: 0.072, // 1 RUB = 0.072 HRK
  },
  {
    code: "CHF",
    name: "Swiss Franc",
    symbol: "Fr",
    flag: "🇨🇭",
    rate: 0.01, // 1 RUB = 0.01 CHF
  },
];

export function useCurrency() {
  const [selectedCurrency, setSelectedCurrency] =
    useState<Currency>(DEFAULT_CURRENCY);
  const [currencies, setCurrencies] = useState<Currency[]>(BASIC_CURRENCIES);
  const [isLoading, setIsLoading] = useState(false); // Never show loading state
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load saved currency from localStorage immediately
  useEffect(() => {
    if (!isClient) return; // Only run on client side

    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      try {
        const parsed = JSON.parse(savedCurrency);
        console.log("Loaded currency from localStorage:", parsed); // Debug log
        // Ensure the parsed currency has all required fields
        if (parsed.code && parsed.name && parsed.symbol && parsed.flag) {
          setSelectedCurrency(parsed);
        }
      } catch (e) {
        console.error("Error parsing saved currency:", e);
        // Remove invalid data
        localStorage.removeItem("selectedCurrency");
      }
    }
  }, [isClient]);

  // Load currencies from API in background (faster update)
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        setError(null);
        console.log("Loading live exchange rates...");
        const rates = await currencyApi.getCBRRates();

        // Update currencies with live rates
        setCurrencies(rates);
        console.log("Live exchange rates loaded successfully");

        // Update selected currency rate if it exists in the new rates
        setSelectedCurrency((prev) => {
          const updatedCurrency = rates.find((r) => r.code === prev.code);
          if (updatedCurrency) {
            console.log(
              `Updated ${prev.code} rate from ${prev.rate} to ${updatedCurrency.rate}`
            );
            return updatedCurrency;
          }
          return prev;
        });
      } catch (err) {
        console.error("Error loading live exchange rates:", err);
        // Silent error - keep using basic currencies
        // Don't show error to user, just log it
      }
    };

    // Load immediately instead of delaying
    loadCurrencies();
  }, []);

  const setCurrency = (currency: Currency) => {
    console.log("Setting currency:", currency); // Debug log
    setSelectedCurrency(currency);

    // Save to localStorage immediately (only on client side)
    if (isClient) {
      try {
        localStorage.setItem("selectedCurrency", JSON.stringify(currency));
        console.log("Currency saved to localStorage:", currency.code); // Debug log
      } catch (e) {
        console.error("Error saving currency to localStorage:", e);
      }
    }
  };

  return {
    selectedCurrency,
    currencies,
    isLoading,
    error,
    setCurrency,
  };
}
