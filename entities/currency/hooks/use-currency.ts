import { useState, useEffect } from "react";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  exchangeRate: number; // Курс к RUB
}

export const AVAILABLE_CURRENCIES: Currency[] = [
  {
    code: "RUB",
    name: "Российский рубль",
    symbol: "₽",
    flag: "🇷🇺",
    exchangeRate: 1,
  },
  {
    code: "USD",
    name: "Доллар США",
    symbol: "$",
    flag: "🇺🇸",
    exchangeRate: 0.011, // Примерный курс
  },
  {
    code: "EUR",
    name: "Евро",
    symbol: "€",
    flag: "🇪🇺",
    exchangeRate: 0.01, // Примерный курс
  },
  {
    code: "BRL",
    name: "Бразильский реал",
    symbol: "R$",
    flag: "🇧🇷",
    exchangeRate: 0.055, // Примерный курс
  },
];

const DEFAULT_CURRENCY = AVAILABLE_CURRENCIES[0]; // RUB по умолчанию
const CURRENCY_STORAGE_KEY = "selectedCurrency";

export function useCurrency() {
  const [currentCurrency, setCurrentCurrency] =
    useState<Currency>(DEFAULT_CURRENCY);
  const [isLoading, setIsLoading] = useState(true);

  // Инициализация валюты при загрузке
  useEffect(() => {
    const initializeCurrency = () => {
      try {
        const savedCurrencyCode = localStorage.getItem(CURRENCY_STORAGE_KEY);

        if (savedCurrencyCode) {
          const foundCurrency = AVAILABLE_CURRENCIES.find(
            (c) => c.code === savedCurrencyCode
          );

          if (foundCurrency) {
            setCurrentCurrency(foundCurrency);
          } else {
            // Если сохраненная валюта не найдена, устанавливаем RUB по умолчанию
            setCurrentCurrency(DEFAULT_CURRENCY);
            localStorage.setItem(CURRENCY_STORAGE_KEY, DEFAULT_CURRENCY.code);
          }
        } else {
          // Если валюта не сохранена, устанавливаем RUB по умолчанию
          setCurrentCurrency(DEFAULT_CURRENCY);
          localStorage.setItem(CURRENCY_STORAGE_KEY, DEFAULT_CURRENCY.code);
        }
      } catch (error) {
        console.error("Error loading currency from localStorage:", error);
        // В случае ошибки устанавливаем RUB по умолчанию
        setCurrentCurrency(DEFAULT_CURRENCY);
        localStorage.setItem(CURRENCY_STORAGE_KEY, DEFAULT_CURRENCY.code);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCurrency();
  }, []);

  // Функция для смены валюты
  const setCurrency = (currency: Currency) => {
    try {
      setCurrentCurrency(currency);
      localStorage.setItem(CURRENCY_STORAGE_KEY, currency.code);
    } catch (error) {
      console.error("Error saving currency to localStorage:", error);
    }
  };

  // Функция для конвертации цены
  const convertPrice = (
    priceInRub: number,
    targetCurrency?: Currency
  ): number => {
    const target = targetCurrency || currentCurrency;
    return priceInRub * target.exchangeRate;
  };

  // Функция для форматирования цены
  const formatPrice = (
    priceInRub: number,
    targetCurrency?: Currency
  ): string => {
    const target = targetCurrency || currentCurrency;
    const convertedPrice = convertPrice(priceInRub, target);

    return `${convertedPrice.toFixed(2)} ${target.symbol}`;
  };

  return {
    currentCurrency,
    setCurrency,
    availableCurrencies: AVAILABLE_CURRENCIES,
    convertPrice,
    formatPrice,
    isLoading,
  };
}
