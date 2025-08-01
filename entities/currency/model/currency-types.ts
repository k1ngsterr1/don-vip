export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number; // Rate against RUB (1 currency = X rubles)
}

export interface CurrencyApiResponse {
  Date: string;
  PreviousDate: string;
  PreviousURL: string;
  Timestamp: string;
  Valute: {
    [key: string]: {
      ID: string;
      NumCode: string;
      CharCode: string;
      Nominal: number;
      Name: string;
      Value: number;
      Previous: number;
    };
  };
}

export interface CurrencyState {
  selectedCurrency: Currency;
  currencies: Currency[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}
