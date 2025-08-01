"use client";

import { useState, useEffect } from "react";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number;
}

const DEFAULT_CURRENCY: Currency = {
  code: "RUB",
  name: "Российский рубль", 
  symbol: "₽",
  flag: "🇷🇺",
  rate: 1,
};

export function useCurrency() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [currencies, setCurrencies] = useState<Currency[]>([DEFAULT_CURRENCY]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading for now
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const setCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
  };

  return {
    selectedCurrency,
    currencies,
    isLoading,
    error,
    setCurrency,
  };
}
