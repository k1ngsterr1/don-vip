/**
 * Утилиты для работы с европейскими валютами
 */

import {
  EUROPEAN_COUNTRIES,
  EUROZONE_COUNTRIES,
} from "../model/european-currencies";
import type { Currency } from "../model/currency-types";

/**
 * Конвертировать европейские страны в формат Currency
 */
export function convertEuropeanCountriesToCurrencies(): Currency[] {
  const currencyMap = new Map<string, Currency>();

  EUROPEAN_COUNTRIES.forEach((country) => {
    if (!currencyMap.has(country.currency)) {
      currencyMap.set(country.currency, {
        code: country.currency,
        name: getCurrencyFullName(country.currency),
        symbol: getCurrencySymbol(country.currency),
        flag: getRepresentativeFlag(country.currency),
        rate: getDefaultRate(country.currency),
      });
    }
  });

  return Array.from(currencyMap.values());
}

/**
 * Получить полное название валюты
 */
function getCurrencyFullName(currencyCode: string): string {
  const names: Record<string, string> = {
    EUR: "Euro",
    RUB: "Российский рубль",
    BGN: "Bulgarian Lev",
    HRK: "Croatian Kuna",
    CZK: "Czech Koruna",
    DKK: "Danish Krone",
    HUF: "Hungarian Forint",
    NOK: "Norwegian Krone",
    PLN: "Polish Zloty",
    RON: "Romanian Leu",
    SEK: "Swedish Krona",
    CHF: "Swiss Franc",
    UAH: "Ukrainian Hryvnia",
    GBP: "British Pound",
  };
  return names[currencyCode] || currencyCode;
}

/**
 * Получить символ валюты
 */
function getCurrencySymbol(currencyCode: string): string {
  const symbols: Record<string, string> = {
    EUR: "€",
    RUB: "₽",
    BGN: "лв",
    HRK: "kn",
    CZK: "Kč",
    DKK: "kr",
    HUF: "Ft",
    NOK: "kr",
    PLN: "zł",
    RON: "lei",
    SEK: "kr",
    CHF: "Fr",
    UAH: "₴",
    GBP: "£",
  };
  return symbols[currencyCode] || currencyCode;
}

/**
 * Получить представительный флаг для валюты
 * Для EUR возвращает флаг ЕС, для остальных - флаг основной страны
 */
function getRepresentativeFlag(currencyCode: string): string {
  if (currencyCode === "EUR") {
    return "🇪🇺";
  }

  const country = EUROPEAN_COUNTRIES.find((c) => c.currency === currencyCode);
  return country?.flag || "🏳️";
}

/**
 * Получить стандартный курс валюты (приблизительный)
 */
function getDefaultRate(currencyCode: string): number {
  const rates: Record<string, number> = {
    EUR: 0.01,
    RUB: 1,
    BGN: 0.02,
    HRK: 0.072,
    CZK: 0.25,
    DKK: 0.075,
    HUF: 4.2,
    NOK: 0.11,
    PLN: 0.044,
    RON: 0.22,
    SEK: 0.11,
    CHF: 0.01,
    UAH: 0.4,
    GBP: 0.009,
  };
  return rates[currencyCode] || 1;
}

/**
 * Получить список всех европейских валют для dropdown
 */
export function getEuropeanCurrencyOptions() {
  return convertEuropeanCountriesToCurrencies().map((currency) => ({
    value: currency.code,
    label: `${currency.flag} ${currency.code} - ${currency.name}`,
    symbol: currency.symbol,
    flag: currency.flag,
  }));
}

/**
 * Проверить, входит ли страна в еврозону
 */
export function isEurozoneCountry(countryCode: string): boolean {
  return EUROZONE_COUNTRIES.some((country) => country.code === countryCode);
}
