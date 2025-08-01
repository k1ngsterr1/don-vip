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
};

// Base RUB currency
const RUB_CURRENCY: Currency = {
  code: "RUB",
  name: "Российский рубль",
  symbol: "₽",
  flag: "🇷🇺",
  rate: 1,
};

class CurrencyApi {
  private readonly CBR_API_URL = "https://www.cbr-xml-daily.ru/daily_json.js";

  async getCBRRates(): Promise<Currency[]> {
    try {
      const response = await fetch(this.CBR_API_URL);

      if (!response.ok) {
        throw new Error(`CBR API error: ${response.status}`);
      }

      const data: CurrencyApiResponse = await response.json();

      const currencies: Currency[] = [RUB_CURRENCY];

      // Process CBR data
      Object.entries(data.Valute).forEach(([key, valute]) => {
        const currencyInfo = CURRENCY_MAP[valute.CharCode];
        if (currencyInfo) {
          currencies.push({
            code: valute.CharCode,
            name: valute.Name,
            symbol: currencyInfo.symbol,
            flag: currencyInfo.flag,
            rate: valute.Value / valute.Nominal, // Rate per 1 unit of currency
          });
        }
      });

      return currencies.sort((a, b) => a.code.localeCompare(b.code));
    } catch (error) {
      console.error("Error fetching CBR rates:", error);
      throw error;
    }
  }

  convertFromRub(amount: number, targetCurrency: Currency): number {
    if (targetCurrency.code === "RUB") return amount;
    return amount / targetCurrency.rate;
  }

  convertToRub(amount: number, sourceCurrency: Currency): number {
    if (sourceCurrency.code === "RUB") return amount;
    return amount * sourceCurrency.rate;
  }
}

export const currencyApi = new CurrencyApi();
