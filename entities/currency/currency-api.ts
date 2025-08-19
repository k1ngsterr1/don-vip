import type { Currency, CurrencyApiResponse } from "../model/currency-types";

// Currency mapping with flags and symbols
const CURRENCY_MAP: Record<string, { flag: string; symbol: string }> = {
  USD: { flag: "🇺🇸", symbol: "$" },
  EUR: { flag: "🇪🇺", symbol: "€" },
  GBP: { flag: "🇬🇧", symbol: "£" },
  CNY: { flag: "🇨🇳", symbol: "¥" },
  JPY: { flag: "🇯🇵", symbol: "¥" },
  KRW: { flag: "🇰🇷", symbol: "₩" },
  CHF: { flag: "🇨🇭", symbol: "Fr" },
  CAD: { flag: "🇨🇦", symbol: "C$" },
  AUD: { flag: "🇦🇺", symbol: "A$" },
  SGD: { flag: "🇸🇬", symbol: "S$" },
  HKD: { flag: "🇭🇰", symbol: "HK$" },
  TWD: { flag: "🇹🇼", symbol: "NT$" },
  THB: { flag: "🇹🇭", symbol: "฿" },
  MYR: { flag: "🇲🇾", symbol: "RM" },
  INR: { flag: "🇮🇳", symbol: "₹" },
  IDR: { flag: "🇮🇩", symbol: "Rp" },
  VND: { flag: "🇻🇳", symbol: "₫" },
  SEK: { flag: "🇸🇪", symbol: "kr" },
  NOK: { flag: "🇳🇴", symbol: "kr" },
  DKK: { flag: "🇩🇰", symbol: "kr" },
  PLN: { flag: "🇵🇱", symbol: "zł" },
  CZK: { flag: "🇨🇿", symbol: "Kč" },
  NZD: { flag: "🇳🇿", symbol: "NZ$" },
  BRL: { flag: "🇧🇷", symbol: "R$" },
  MXN: { flag: "🇲🇽", symbol: "$" },
  ARS: { flag: "🇦🇷", symbol: "$" },
  ZAR: { flag: "🇿🇦", symbol: "R" },
  TRY: { flag: "🇹🇷", symbol: "₺" },
  EGP: { flag: "🇪🇬", symbol: "£" },
  RUB: { flag: "🇷🇺", symbol: "₽" },
  // Additional European currencies
  ALL: { flag: "🇦🇱", symbol: "L" },
  BAM: { flag: "🇧🇦", symbol: "КМ" },
  BGN: { flag: "🇧🇬", symbol: "лв" },
  BYN: { flag: "🇧🇾", symbol: "Br" },
  HUF: { flag: "🇭🇺", symbol: "Ft" },
  ISK: { flag: "🇮🇸", symbol: "kr" },
  MKD: { flag: "🇲🇰", symbol: "ден" },
  MDL: { flag: "🇲🇩", symbol: "L" },
  RON: { flag: "🇷🇴", symbol: "lei" },
  RSD: { flag: "🇷🇸", symbol: "din" },
  UAH: { flag: "🇺🇦", symbol: "₴" },
  // Additional Asian currencies
  AFN: { flag: "🇦🇫", symbol: "؋" },
  AMD: { flag: "🇦🇲", symbol: "֏" },
  AZN: { flag: "🇦🇿", symbol: "₼" },
  BDT: { flag: "🇧🇩", symbol: "৳" },
  BTN: { flag: "🇧🇹", symbol: "Nu." },
  BND: { flag: "🇧🇳", symbol: "B$" },
  KHR: { flag: "🇰🇭", symbol: "៛" },
  GEL: { flag: "🇬🇪", symbol: "₾" },
  IRR: { flag: "🇮🇷", symbol: "﷼" },
  IQD: { flag: "🇮🇶", symbol: "ع.د" },
  ILS: { flag: "🇮🇱", symbol: "₪" },
  JOD: { flag: "🇯🇴", symbol: "د.ا" },
  KZT: { flag: "🇰🇿", symbol: "₸" },
  KWD: { flag: "🇰🇼", symbol: "د.ك" },
  KGS: { flag: "🇰🇬", symbol: "с" },
  LAK: { flag: "🇱🇦", symbol: "₭" },
  LBP: { flag: "🇱🇧", symbol: "ل.ل" },
  MOP: { flag: "🇲🇴", symbol: "MOP$" },
  MVR: { flag: "🇲🇻", symbol: "Rf" },
  MNT: { flag: "🇲🇳", symbol: "₮" },
  MMK: { flag: "🇲🇲", symbol: "Ks" },
  NPR: { flag: "🇳🇵", symbol: "Rs" },
  KPW: { flag: "🇰🇵", symbol: "₩" },
  OMR: { flag: "🇴🇲", symbol: "ر.ع." },
  PKR: { flag: "🇵🇰", symbol: "Rs" },
  PHP: { flag: "🇵🇭", symbol: "₱" },
  QAR: { flag: "🇶🇦", symbol: "ر.ق" },
  SAR: { flag: "🇸🇦", symbol: "ر.س" },
  LKR: { flag: "🇱🇰", symbol: "Rs" },
  SYP: { flag: "🇸🇾", symbol: "ل.س" },
  TJS: { flag: "🇹🇯", symbol: "ЅМ" },
  TMT: { flag: "🇹🇲", symbol: "m" },
  AED: { flag: "🇦🇪", symbol: "د.إ" },
  UZS: { flag: "🇺🇿", symbol: "сўм" },
  YER: { flag: "🇾🇪", symbol: "﷼" },
  // African currencies
  GHS: { flag: "🇬🇭", symbol: "₵" },
  // More currencies will be added as needed
};

// Base RUB currency
const RUB_CURRENCY: Currency = {
  code: "RUB",
  name: "Российский рубль",
  symbol: "₽",
  flag: "🇷🇺",
  rate: 1,
};

// Helper function to get currency names
function getCurrencyName(code: string): string {
  const names: Record<string, string> = {
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    CNY: "Chinese Yuan",
    JPY: "Japanese Yen",
    KRW: "South Korean Won",
    CHF: "Swiss Franc",
    CAD: "Canadian Dollar",
    AUD: "Australian Dollar",
    SGD: "Singapore Dollar",
    HKD: "Hong Kong Dollar",
    TWD: "Taiwan Dollar",
    THB: "Thai Baht",
    MYR: "Malaysian Ringgit",
    INR: "Indian Rupee",
    IDR: "Indonesian Rupiah",
    VND: "Vietnamese Dong",
    SEK: "Swedish Krona",
    NOK: "Norwegian Krone",
    DKK: "Danish Krone",
    PLN: "Polish Zloty",
    CZK: "Czech Koruna",
    NZD: "New Zealand Dollar",
    BRL: "Brazilian Real",
    MXN: "Mexican Peso",
    ARS: "Argentine Peso",
    ZAR: "South African Rand",
    TRY: "Turkish Lira",
    EGP: "Egyptian Pound",
    RUB: "Российский рубль",
    ALL: "Albanian Lek",
    BAM: "Bosnia and Herzegovina Convertible Mark",
    BGN: "Bulgarian Lev",
    BYN: "Belarusian Ruble",
    HUF: "Hungarian Forint",
    ISK: "Icelandic Krona",
    MKD: "Macedonian Denar",
    MDL: "Moldovan Leu",
    RON: "Romanian Leu",
    RSD: "Serbian Dinar",
    UAH: "Ukrainian Hryvnia",
  };
  return names[code] || code;
}

class CurrencyApi {
  private readonly EXCHANGE_API_URL =
    "https://api.exchangerate-api.com/v4/latest/RUB";
  private readonly FALLBACK_API_URL =
    "https://api.fxratesapi.com/latest?base=RUB";

  async getCBRRates(): Promise<Currency[]> {
    try {
      // Try primary API first
      let response = await fetch(this.EXCHANGE_API_URL);
      let data: any;

      if (!response.ok) {
        console.warn("Primary API failed, trying fallback...");
        // Try fallback API
        response = await fetch(this.FALLBACK_API_URL);
        if (!response.ok) {
          throw new Error(`Both APIs failed. Status: ${response.status}`);
        }
      }

      data = await response.json();
      const rates = data.rates;

      const currencies: Currency[] = [RUB_CURRENCY];

      // Add currencies with actual rates from API
      Object.entries(rates).forEach(([code, rate]) => {
        const currencyInfo = CURRENCY_MAP[code];
        if (currencyInfo && typeof rate === "number") {
          currencies.push({
            code,
            name: getCurrencyName(code),
            symbol: currencyInfo.symbol,
            flag: currencyInfo.flag,
            rate: rate, // This is how many units of foreign currency you get for 1 RUB
          });
        }
      });

      console.log(`Loaded ${currencies.length} currencies with live rates`);
      return currencies.sort((a, b) => a.code.localeCompare(b.code));
    } catch (error) {
      console.error("Error fetching live exchange rates:", error);

      // Return fallback currencies with approximate rates
      return [
        RUB_CURRENCY,
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
          rate: 1.65,
        },
        {
          code: "KRW",
          name: "South Korean Won",
          symbol: "₩",
          flag: "🇰🇷",
          rate: 14.5,
        },
        {
          code: "SGD",
          name: "Singapore Dollar",
          symbol: "S$",
          flag: "🇸🇬",
          rate: 0.015,
        },
        {
          code: "THB",
          name: "Thai Baht",
          symbol: "฿",
          flag: "🇹🇭",
          rate: 0.4,
        },
        {
          code: "MYR",
          name: "Malaysian Ringgit",
          symbol: "RM",
          flag: "🇲🇾",
          rate: 0.05,
        },
        {
          code: "INR",
          name: "Indian Rupee",
          symbol: "₹",
          flag: "🇮🇳",
          rate: 0.91,
        },
        {
          code: "AUD",
          name: "Australian Dollar",
          symbol: "A$",
          flag: "🇦🇺",
          rate: 0.017,
        },
        {
          code: "CAD",
          name: "Canadian Dollar",
          symbol: "C$",
          flag: "🇨🇦",
          rate: 0.015,
        },
        {
          code: "CZK",
          name: "Czech Koruna",
          symbol: "Kč",
          flag: "🇨🇿",
          rate: 0.25,
        },
        {
          code: "PLN",
          name: "Polish Zloty",
          symbol: "zł",
          flag: "🇵🇱",
          rate: 0.044,
        },
        {
          code: "SEK",
          name: "Swedish Krona",
          symbol: "kr",
          flag: "🇸🇪",
          rate: 0.11,
        },
        {
          code: "NOK",
          name: "Norwegian Krone",
          symbol: "kr",
          flag: "🇳🇴",
          rate: 0.11,
        },
        {
          code: "DKK",
          name: "Danish Krone",
          symbol: "kr",
          flag: "🇩🇰",
          rate: 0.075,
        },
      ];
    }
  }

  convertFromRub(amount: number, targetCurrency: Currency): number {
    if (targetCurrency.code === "RUB") return amount;
    return amount * targetCurrency.rate; // Multiply by rate to convert FROM RUB
  }

  convertToRub(amount: number, sourceCurrency: Currency): number {
    if (sourceCurrency.code === "RUB") return amount;
    return amount / sourceCurrency.rate; // Divide by rate to convert TO RUB
  }
}

export const currencyApi = new CurrencyApi();
