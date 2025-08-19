export interface UpdateCurrencyDto {
  preferred_currency: string;
  country_code?: string;
}

export interface UpdateCurrencyResponse {
  message: string;
  user: {
    id: number;
    preferred_currency: string;
    country_code: string;
    email: string;
  };
}
