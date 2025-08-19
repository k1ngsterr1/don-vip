export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number;
}

export interface CurrencyRate {
  currency: string;
  rate: number;
}

export interface CurrencyResponse {
  currencies: Currency[];
  base: string;
  timestamp: number;
}

export interface CurrencyApiResponse {
  rates: Record<string, number>;
  base: string;
  timestamp?: number;
}
