import type { Currency, CurrencyApiResponse } from "../model/currency-types";

// Currency mapping with flags and symbols - South America currencies only
const CURRENCY_MAP: Record<string, { flag: string; symbol: string }> = {
  RUB: { flag: "", symbol: "₽" },
  // South American currencies
  USD: { flag: "🇸", symbol: "$" }, // Used by Bolivia, Chile, Colombia, Ecuador, Guyana, Paraguay, Peru, Suriname, Uruguay, Venezuela
  EUR: { flag: "��", symbol: "€" }, // Used by French Guiana
  BRL: { flag: "��", symbol: "R$" }, // Brazil
  ARS: { flag: "��", symbol: "$" }, // Argentina
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
    RUB: "Российский рубль",
    BRL: "Brazilian Real",
    ARS: "Argentine Peso",
    USD: "US Dollar", // Used by Bolivia, Chile, Colombia, Ecuador, Guyana, Paraguay, Peru, Suriname, Uruguay, Venezuela
    EUR: "Euro", // Used by French Guiana
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
          code: "BRL",
          name: "Brazilian Real",
          symbol: "R$",
          flag: "��",
          rate: 0.058,
        },
        {
          code: "ARS",
          name: "Argentine Peso",
          symbol: "$",
          flag: "��",
          rate: 9.85,
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
