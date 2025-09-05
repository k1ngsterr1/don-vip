/**
 * Европейские валюты и страны
 * Данный файл содержит информацию о европейских валютах и странах
 */

export interface EuropeanCountry {
  code: string;
  name: string;
  currency: string;
  flag: string;
  language: string;
}

export const EUROPEAN_COUNTRIES: EuropeanCountry[] = [
  {
    code: "RU",
    name: "RUSSIA",
    currency: "RUB",
    flag: "🇷🇺",
    language: "Русский",
  },
  {
    code: "AT",
    name: "AUSTRIA",
    currency: "EUR",
    flag: "🇦🇹",
    language: "Deutsch",
  },
  {
    code: "BE",
    name: "BELGIUM",
    currency: "EUR",
    flag: "🇧🇪",
    language: "Français",
  },
  {
    code: "BG",
    name: "BULGARIA",
    currency: "BGN",
    flag: "🇧🇬",
    language: "Български",
  },
  {
    code: "HR",
    name: "CROATIA",
    currency: "HRK",
    flag: "🇭🇷",
    language: "Hrvatski",
  },
  {
    code: "CY",
    name: "CYPRUS",
    currency: "EUR",
    flag: "🇨🇾",
    language: "Ελληνικά",
  },
  {
    code: "CZ",
    name: "CZECH REPUBLIC",
    currency: "CZK",
    flag: "🇨🇿",
    language: "Čeština",
  },
  {
    code: "DK",
    name: "DENMARK",
    currency: "DKK",
    flag: "🇩🇰",
    language: "Dansk",
  },
  {
    code: "EE",
    name: "ESTONIA",
    currency: "EUR",
    flag: "🇪🇪",
    language: "Eesti",
  },
  {
    code: "FI",
    name: "FINLAND",
    currency: "EUR",
    flag: "🇫🇮",
    language: "Suomi",
  },
  {
    code: "FR",
    name: "FRANCE",
    currency: "EUR",
    flag: "🇫🇷",
    language: "Français",
  },
  {
    code: "DE",
    name: "GERMANY",
    currency: "EUR",
    flag: "🇩🇪",
    language: "Deutsch",
  },
  {
    code: "GR",
    name: "GREECE",
    currency: "EUR",
    flag: "🇬🇷",
    language: "Ελληνικά",
  },
  {
    code: "HU",
    name: "HUNGARY",
    currency: "HUF",
    flag: "🇭🇺",
    language: "Magyar",
  },
  {
    code: "IE",
    name: "IRELAND",
    currency: "EUR",
    flag: "🇮🇪",
    language: "English",
  },
  {
    code: "IT",
    name: "ITALY",
    currency: "EUR",
    flag: "🇮🇹",
    language: "Italiano",
  },
  {
    code: "LV",
    name: "LATVIA",
    currency: "EUR",
    flag: "🇱🇻",
    language: "Latviešu",
  },
  {
    code: "LT",
    name: "LITHUANIA",
    currency: "EUR",
    flag: "🇱🇹",
    language: "Lietuvių",
  },
  {
    code: "LU",
    name: "LUXEMBOURG",
    currency: "EUR",
    flag: "🇱🇺",
    language: "Français",
  },
  {
    code: "MT",
    name: "MALTA",
    currency: "EUR",
    flag: "🇲🇹",
    language: "English",
  },
  {
    code: "NL",
    name: "NETHERLANDS",
    currency: "EUR",
    flag: "🇳🇱",
    language: "Nederlands",
  },
  {
    code: "NO",
    name: "NORWAY",
    currency: "NOK",
    flag: "🇳🇴",
    language: "Norsk",
  },
  {
    code: "PL",
    name: "POLAND",
    currency: "PLN",
    flag: "🇵🇱",
    language: "Polski",
  },
  {
    code: "PT",
    name: "PORTUGAL",
    currency: "EUR",
    flag: "🇵🇹",
    language: "Português",
  },
  {
    code: "RO",
    name: "ROMANIA",
    currency: "RON",
    flag: "🇷🇴",
    language: "Română",
  },
  {
    code: "SK",
    name: "SLOVAKIA",
    currency: "EUR",
    flag: "🇸🇰",
    language: "Slovenčina",
  },
  {
    code: "SI",
    name: "SLOVENIA",
    currency: "EUR",
    flag: "🇸🇮",
    language: "Slovenščina",
  },
  {
    code: "ES",
    name: "SPAIN",
    currency: "EUR",
    flag: "🇪🇸",
    language: "Español",
  },
  {
    code: "SE",
    name: "SWEDEN",
    currency: "SEK",
    flag: "🇸🇪",
    language: "Svenska",
  },
  {
    code: "CH",
    name: "SWITZERLAND",
    currency: "CHF",
    flag: "🇨🇭",
    language: "Deutsch",
  },
  {
    code: "UA",
    name: "UKRAINE",
    currency: "UAH",
    flag: "🇺🇦",
    language: "Українська",
  },
  {
    code: "GB",
    name: "UNITED KINGDOM",
    currency: "GBP",
    flag: "🇬🇧",
    language: "English",
  },
];

export const EUROZONE_COUNTRIES = EUROPEAN_COUNTRIES.filter(
  (country) => country.currency === "EUR"
);

export const NON_EUROZONE_EUROPEAN_COUNTRIES = EUROPEAN_COUNTRIES.filter(
  (country) => country.currency !== "EUR"
);

/**
 * Получить информацию о европейской стране по коду валюты
 */
export function getEuropeanCountryByCurrency(
  currencyCode: string
): EuropeanCountry | undefined {
  return EUROPEAN_COUNTRIES.find(
    (country) => country.currency === currencyCode
  );
}

/**
 * Получить все европейские валюты
 */
export function getEuropeanCurrencies(): string[] {
  return [...new Set(EUROPEAN_COUNTRIES.map((country) => country.currency))];
}

/**
 * Проверить, является ли валюта европейской
 */
export function isEuropeanCurrency(currencyCode: string): boolean {
  return getEuropeanCurrencies().includes(currencyCode);
}
