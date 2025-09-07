import type { Currency, CurrencyApiResponse } from "../model/currency-types";

// Currency mapping with flags and symbols
const CURRENCY_MAP: Record<string, { flag: string; symbol: string }> = {
  EUR: { flag: "🇪🇺", symbol: "€" },
  RUB: { flag: "🇷🇺", symbol: "₽" },

  // Additional European currencies (Eurozone and others)
  CYP: { flag: "🇨🇾", symbol: "€" }, // Cyprus (Euro)
  EEK: { flag: "🇪🇪", symbol: "€" }, // Estonia (Euro)
  ESP: { flag: "🇪🇸", symbol: "€" }, // Spain (Euro)
  FIM: { flag: "🇫🇮", symbol: "€" }, // Finland (Euro)
  FRF: { flag: "🇫🇷", symbol: "€" }, // France (Euro)
  GRD: { flag: "🇬🇷", symbol: "€" }, // Greece (Euro)
  IEP: { flag: "🇮🇪", symbol: "€" }, // Ireland (Euro)
  ITL: { flag: "🇮🇹", symbol: "€" }, // Italy (Euro)
  LTL: { flag: "🇱🇹", symbol: "€" }, // Lithuania (Euro)
  LUF: { flag: "🇱🇺", symbol: "€" }, // Luxembourg (Euro)
  LVL: { flag: "🇱🇻", symbol: "€" }, // Latvia (Euro)
  MTL: { flag: "🇲🇹", symbol: "€" }, // Malta (Euro)
  NLG: { flag: "🇳🇱", symbol: "€" }, // Netherlands (Euro)
  ATS: { flag: "🇦🇹", symbol: "€" }, // Austria (Euro)
  BEF: { flag: "🇧🇪", symbol: "€" }, // Belgium (Euro)
  DEM: { flag: "🇩🇪", symbol: "€" }, // Germany (Euro)
  PTE: { flag: "🇵🇹", symbol: "€" }, // Portugal (Euro)
  SKK: { flag: "🇸🇰", symbol: "€" }, // Slovakia (Euro)
  SIT: { flag: "🇸🇮", symbol: "€" }, // Slovenia (Euro)

  KZT: { flag: "🇰🇿", symbol: "₸" },
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
    // European countries (Eurozone)
    CYP: "Cyprus Euro",
    EEK: "Estonia Euro",
    ESP: "Spain Euro",
    FIM: "Finland Euro",
    FRF: "France Euro",
    GRD: "Greece Euro",
    IEP: "Ireland Euro",
    ITL: "Italy Euro",
    LTL: "Lithuania Euro",
    LUF: "Luxembourg Euro",
    LVL: "Latvia Euro",
    MTL: "Malta Euro",
    NLG: "Netherlands Euro",
    ATS: "Austria Euro",
    BEF: "Belgium Euro",
    DEM: "Germany Euro",
    PTE: "Portugal Euro",
    SKK: "Slovakia Euro",
    SIT: "Slovenia Euro",
    HRK: "Croatian Kuna",
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
        {
          code: "HRK",
          name: "Croatian Kuna",
          symbol: "kn",
          flag: "🇭🇷",
          rate: 0.072,
        },
        {
          code: "CHF",
          name: "Swiss Franc",
          symbol: "Fr",
          flag: "🇨🇭",
          rate: 0.01,
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
