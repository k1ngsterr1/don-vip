"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCurrency } from "@/entities/currency/hooks/use-currency";
import { Button } from "@/shared/ui/button/button";
import { ArrowLeft, Loader2, Search, X } from "lucide-react";
import { Link } from "@/i18n/routing";

interface CountryCurrency {
  country: string;
  language: string;
  currency: string;
  flag: string;
}

// Countries with their currencies organized by regions like SEAGM
const COUNTRIES_BY_REGION = {
  EUROPE: [
    { country: "ALBANIA", language: "English", currency: "ALL", flag: "🇦🇱" },
    { country: "ANDORRA", language: "English", currency: "EUR", flag: "🇦🇩" },
    { country: "AUSTRIA", language: "Deutsch", currency: "EUR", flag: "🇦🇹" },
    { country: "BELARUS", language: "Русский", currency: "BYN", flag: "🇧🇾" },
    { country: "BELGIUM", language: "Nederlands", currency: "EUR", flag: "🇧🇪" },
    {
      country: "BOSNIA AND HERZEGOVINA",
      language: "English",
      currency: "BAM",
      flag: "🇧🇦",
    },
    { country: "BULGARIA", language: "English", currency: "BGN", flag: "🇧🇬" },
    { country: "CROATIA", language: "English", currency: "EUR", flag: "🇭🇷" },
    {
      country: "CZECH REPUBLIC",
      language: "English",
      currency: "CZK",
      flag: "🇨🇿",
    },
    { country: "DENMARK", language: "English", currency: "DKK", flag: "🇩🇰" },
    { country: "ESTONIA", language: "English", currency: "EUR", flag: "🇪🇪" },
    {
      country: "FAROE ISLANDS",
      language: "English",
      currency: "DKK",
      flag: "🇫🇴",
    },
    { country: "FINLAND", language: "English", currency: "EUR", flag: "🇫🇮" },
    { country: "FRANCE", language: "Français", currency: "EUR", flag: "🇫🇷" },
    { country: "GERMANY", language: "Deutsch", currency: "EUR", flag: "🇩🇪" },
    { country: "GIBRALTAR", language: "English", currency: "GBP", flag: "🇬🇮" },
    { country: "GREECE", language: "English", currency: "EUR", flag: "🇬🇷" },
    { country: "HUNGARY", language: "English", currency: "HUF", flag: "🇭🇺" },
    { country: "ICELAND", language: "English", currency: "ISK", flag: "🇮🇸" },
    { country: "IRELAND", language: "English", currency: "EUR", flag: "🇮🇪" },
    {
      country: "ISLE OF MAN",
      language: "English",
      currency: "GBP",
      flag: "🇮🇲",
    },
    { country: "ITALY", language: "Italiano", currency: "EUR", flag: "🇮🇹" },
    { country: "LATVIA", language: "English", currency: "EUR", flag: "🇱🇻" },
    {
      country: "LIECHTENSTEIN",
      language: "Deutsch",
      currency: "CHF",
      flag: "🇱🇮",
    },
    { country: "LITHUANIA", language: "English", currency: "EUR", flag: "🇱🇹" },
    { country: "LUXEMBOURG", language: "English", currency: "EUR", flag: "🇱🇺" },
    { country: "MACEDONIA", language: "English", currency: "MKD", flag: "🇲🇰" },
    { country: "MALTA", language: "English", currency: "EUR", flag: "🇲🇹" },
    { country: "MOLDOVA", language: "English", currency: "MDL", flag: "🇲🇩" },
    { country: "MONACO", language: "Français", currency: "EUR", flag: "🇲🇨" },
    { country: "MONTENEGRO", language: "English", currency: "EUR", flag: "🇲🇪" },
    {
      country: "NETHERLANDS",
      language: "Nederlands",
      currency: "EUR",
      flag: "🇳🇱",
    },
    { country: "NORWAY", language: "English", currency: "NOK", flag: "🇳🇴" },
    { country: "POLAND", language: "English", currency: "PLN", flag: "🇵🇱" },
    { country: "PORTUGAL", language: "Português", currency: "EUR", flag: "🇵🇹" },
    { country: "ROMANIA", language: "Română", currency: "RON", flag: "🇷🇴" },
    { country: "RUSSIA", language: "Русский", currency: "RUB", flag: "🇷🇺" },
    { country: "SAN MARINO", language: "English", currency: "EUR", flag: "🇸🇲" },
    { country: "SERBIA", language: "English", currency: "RSD", flag: "🇷🇸" },
    { country: "SLOVAKIA", language: "English", currency: "EUR", flag: "🇸🇰" },
    { country: "SLOVENIA", language: "English", currency: "EUR", flag: "🇸🇮" },
    { country: "SPAIN", language: "Español", currency: "EUR", flag: "🇪🇸" },
    { country: "SWEDEN", language: "English", currency: "SEK", flag: "🇸🇪" },
    {
      country: "SWITZERLAND",
      language: "English",
      currency: "CHF",
      flag: "🇨🇭",
    },
    { country: "UKRAINE", language: "English", currency: "UAH", flag: "🇺🇦" },
    {
      country: "UNITED KINGDOM",
      language: "English",
      currency: "GBP",
      flag: "🇬🇧",
    },
    {
      country: "VATICAN CITY",
      language: "English",
      currency: "EUR",
      flag: "🇻🇦",
    },
  ],
  ASIA: [
    {
      country: "AFGHANISTAN",
      language: "English",
      currency: "AFN",
      flag: "🇦🇫",
    },
    { country: "ARMENIA", language: "English", currency: "AMD", flag: "🇦🇲" },
    { country: "AZERBAIJAN", language: "Русский", currency: "AZN", flag: "🇦🇿" },
    { country: "BANGLADESH", language: "English", currency: "BDT", flag: "🇧🇩" },
    { country: "BHUTAN", language: "English", currency: "BTN", flag: "🇧🇹" },
    { country: "BRUNEI", language: "English", currency: "BND", flag: "🇧🇳" },
    { country: "CAMBODIA", language: "English", currency: "KHR", flag: "🇰🇭" },
    { country: "CHINA", language: "简体中文", currency: "CNY", flag: "🇨🇳" },
    { country: "CYPRUS", language: "English", currency: "EUR", flag: "🇨🇾" },
    { country: "GEORGIA", language: "English", currency: "GEL", flag: "🇬🇪" },
    { country: "HONG KONG", language: "繁體中文", currency: "HKD", flag: "🇭🇰" },
    { country: "INDIA", language: "English", currency: "INR", flag: "🇮🇳" },
    {
      country: "INDONESIA",
      language: "Bahasa Indonesia",
      currency: "IDR",
      flag: "🇮🇩",
    },
    { country: "JAPAN", language: "日本語", currency: "JPY", flag: "🇯🇵" },
    { country: "KAZAKHSTAN", language: "Русский", currency: "KZT", flag: "🇰🇿" },
    { country: "KYRGYZSTAN", language: "Русский", currency: "KGS", flag: "🇰🇬" },
    { country: "LAOS", language: "ລາວ", currency: "LAK", flag: "🇱🇦" },
    { country: "MACAU", language: "繁體中文", currency: "MOP", flag: "🇲🇴" },
    {
      country: "MALAYSIA",
      language: "Bahasa Malaysia",
      currency: "MYR",
      flag: "🇲🇾",
    },
    { country: "MALDIVES", language: "English", currency: "MVR", flag: "🇲🇻" },
    { country: "MONGOLIA", language: "Монгол", currency: "MNT", flag: "🇲🇳" },
    { country: "MYANMAR", language: "ဗမာစာ", currency: "MMK", flag: "🇲🇲" },
    { country: "NEPAL", language: "नेपाली", currency: "NPR", flag: "🇳🇵" },
    { country: "PAKISTAN", language: "اردو", currency: "PKR", flag: "🇵🇰" },
    {
      country: "PHILIPPINES",
      language: "Tagalog",
      currency: "PHP",
      flag: "🇵🇭",
    },
    { country: "SINGAPORE", language: "English", currency: "SGD", flag: "🇸🇬" },
    { country: "SOUTH KOREA", language: "한국어", currency: "KRW", flag: "🇰🇷" },
    { country: "SRI LANKA", language: "සිංහල", currency: "LKR", flag: "🇱🇰" },
    { country: "TAIWAN", language: "繁體中文", currency: "TWD", flag: "🇹🇼" },
    { country: "TAJIKISTAN", language: "Русский", currency: "TJS", flag: "🇹🇯" },
    { country: "THAILAND", language: "ภาษาไทย", currency: "THB", flag: "🇹🇭" },
    {
      country: "TIMOR-LESTE",
      language: "Português",
      currency: "USD",
      flag: "🇹🇱",
    },
    { country: "TURKEY", language: "English", currency: "TRY", flag: "🇹🇷" },
    {
      country: "TURKMENISTAN",
      language: "Русский",
      currency: "USD",
      flag: "🇹🇲",
    },
    {
      country: "UZBEKISTAN",
      language: "English",
      currency: "USD",
      flag: "🇺🇿",
    },
    { country: "VIETNAM", language: "Việt", currency: "VND", flag: "🇻🇳" },
  ],
  "NORTH AMERICA": [
    { country: "ANGUILLA", language: "English", currency: "USD", flag: "🇦🇮" },
    {
      country: "ANTIGUA AND BARBUDA",
      language: "English",
      currency: "USD",
      flag: "🇦🇬",
    },
    { country: "ARUBA", language: "Nederlands", currency: "USD", flag: "🇦🇼" },
    { country: "BAHAMAS", language: "English", currency: "USD", flag: "🇧🇸" },
    { country: "BARBADOS", language: "English", currency: "USD", flag: "🇧🇧" },
    { country: "BERMUDA", language: "English", currency: "USD", flag: "🇧🇲" },
    {
      country: "BRITISH VIRGIN ISLANDS",
      language: "English",
      currency: "USD",
      flag: "🇻🇬",
    },
    { country: "CANADA", language: "English", currency: "CAD", flag: "🇨🇦" },
    {
      country: "CAYMAN ISLANDS",
      language: "English",
      currency: "USD",
      flag: "🇰🇾",
    },
    { country: "COSTA RICA", language: "Español", currency: "USD", flag: "🇨🇷" },
    { country: "DOMINICA", language: "English", currency: "USD", flag: "🇩🇲" },
    {
      country: "DOMINICAN REPUBLIC",
      language: "Español",
      currency: "USD",
      flag: "🇩🇴",
    },
    {
      country: "EL SALVADOR",
      language: "Español",
      currency: "USD",
      flag: "🇸🇻",
    },
    { country: "GREENLAND", language: "English", currency: "DKK", flag: "🇬🇱" },
    { country: "GRENADA", language: "English", currency: "USD", flag: "🇬🇩" },
    { country: "GUADELOUPE", language: "English", currency: "EUR", flag: "🇬🇵" },
    { country: "GUATEMALA", language: "Español", currency: "USD", flag: "🇬🇹" },
    { country: "HAITI", language: "Français", currency: "USD", flag: "🇭🇹" },
    { country: "HONDURAS", language: "Español", currency: "USD", flag: "🇭🇳" },
    { country: "JAMAICA", language: "English", currency: "USD", flag: "🇯🇲" },
    {
      country: "MARTINIQUE",
      language: "Français",
      currency: "EUR",
      flag: "🇲🇶",
    },
    { country: "MEXICO", language: "Español", currency: "MXN", flag: "🇲🇽" },
    { country: "MONTSERRAT", language: "English", currency: "USD", flag: "🇲🇸" },
    { country: "NICARAGUA", language: "Español", currency: "USD", flag: "🇳🇮" },
    { country: "PANAMA", language: "Español", currency: "USD", flag: "🇵🇦" },
    {
      country: "PUERTO RICO",
      language: "Español",
      currency: "USD",
      flag: "🇵🇷",
    },
    {
      country: "SAINT BARTHELEMY",
      language: "Français",
      currency: "EUR",
      flag: "🇧🇱",
    },
    {
      country: "SAINT KITTS AND NEVIS",
      language: "English",
      currency: "USD",
      flag: "🇰🇳",
    },
    {
      country: "SAINT LUCIA",
      language: "English",
      currency: "USD",
      flag: "🇱🇨",
    },
    {
      country: "SAINT MARTIN",
      language: "Français",
      currency: "EUR",
      flag: "🇲🇫",
    },
    {
      country: "SAINT PIERRE AND MIQUELON",
      language: "Français",
      currency: "EUR",
      flag: "🇵🇲",
    },
    {
      country: "SAINT VINCENT AND THE GRENADINES",
      language: "English",
      currency: "USD",
      flag: "🇻🇨",
    },
    {
      country: "TURKS AND CAICOS ISLANDS",
      language: "English",
      currency: "USD",
      flag: "🇹🇨",
    },
    {
      country: "UNITED STATES",
      language: "English",
      currency: "USD",
      flag: "🇺🇸",
    },
  ],
  AFRICA: [
    { country: "ALGERIA", language: "English", currency: "USD", flag: "🇩🇿" },
    { country: "ANGOLA", language: "Português", currency: "USD", flag: "🇦🇴" },
    { country: "BENIN", language: "Français", currency: "USD", flag: "🇧🇯" },
    { country: "BOTSWANA", language: "English", currency: "USD", flag: "🇧🇼" },
    {
      country: "BURKINA FASO",
      language: "Français",
      currency: "USD",
      flag: "🇧🇫",
    },
    { country: "BURUNDI", language: "Français", currency: "USD", flag: "🇧🇮" },
    { country: "CAMEROON", language: "Français", currency: "USD", flag: "🇨🇲" },
    {
      country: "CAPE VERDE",
      language: "Português",
      currency: "USD",
      flag: "🇨🇻",
    },
    {
      country: "CENTRAL AFRICAN REPUBLIC",
      language: "Français",
      currency: "USD",
      flag: "🇨🇫",
    },
    { country: "CHAD", language: "Français", currency: "USD", flag: "🇹🇩" },
    { country: "COMOROS", language: "Français", currency: "USD", flag: "🇰🇲" },
    { country: "CONGO", language: "Français", currency: "USD", flag: "🇨🇬" },
    {
      country: "CÔTE D'IVOIRE",
      language: "Français",
      currency: "USD",
      flag: "🇨🇮",
    },
    {
      country: "DEMOCRATIC REPUBLIC CONGO",
      language: "Français",
      currency: "USD",
      flag: "🇨🇩",
    },
    { country: "DJIBOUTI", language: "Français", currency: "USD", flag: "🇩🇯" },
    { country: "EGYPT", language: "English", currency: "EGP", flag: "🇪🇬" },
    {
      country: "EQUATORIAL GUINEA",
      language: "English",
      currency: "USD",
      flag: "🇬🇶",
    },
    { country: "ERITREA", language: "English", currency: "USD", flag: "🇪🇷" },
    { country: "ETHIOPIA", language: "English", currency: "USD", flag: "🇪🇹" },
    { country: "GABON", language: "Français", currency: "USD", flag: "🇬🇦" },
    { country: "GAMBIA", language: "English", currency: "USD", flag: "🇬🇲" },
    { country: "GHANA", language: "English", currency: "GHS", flag: "🇬🇭" },
    { country: "GUINEA", language: "Français", currency: "USD", flag: "🇬🇳" },
    {
      country: "GUINEA-BISSAU",
      language: "Português",
      currency: "USD",
      flag: "🇬🇼",
    },
    {
      country: "IVORY COAST",
      language: "Français",
      currency: "USD",
      flag: "🇨🇮",
    },
    { country: "KENYA", language: "English", currency: "USD", flag: "🇰🇪" },
    { country: "LESOTHO", language: "English", currency: "USD", flag: "🇱🇸" },
    { country: "LIBERIA", language: "English", currency: "USD", flag: "🇱🇷" },
    { country: "LIBYA", language: "English", currency: "USD", flag: "🇱🇾" },
    {
      country: "MADAGASCAR",
      language: "Français",
      currency: "USD",
      flag: "🇲🇬",
    },
    { country: "MALAWI", language: "English", currency: "USD", flag: "🇲🇼" },
    { country: "MALI", language: "Français", currency: "USD", flag: "🇲🇱" },
    { country: "MAURITANIA", language: "العربية", currency: "USD", flag: "🇲🇷" },
    { country: "MAURITIUS", language: "English", currency: "USD", flag: "🇲🇺" },
    { country: "MAYOTTE", language: "Français", currency: "EUR", flag: "🇾🇹" },
    { country: "MOROCCO", language: "English", currency: "USD", flag: "🇲🇦" },
    {
      country: "MOZAMBIQUE",
      language: "Português",
      currency: "USD",
      flag: "🇲🇿",
    },
    { country: "NAMIBIA", language: "English", currency: "USD", flag: "🇳🇦" },
    { country: "NIGER", language: "Français", currency: "USD", flag: "🇳🇪" },
    { country: "NIGERIA", language: "English", currency: "USD", flag: "🇳🇬" },
    { country: "RWANDA", language: "English", currency: "USD", flag: "🇷🇼" },
    {
      country: "SAO TOME AND PRINCIPE",
      language: "Português",
      currency: "USD",
      flag: "🇸🇹",
    },
    { country: "SENEGAL", language: "Français", currency: "USD", flag: "🇸🇳" },
    { country: "SEYCHELLES", language: "English", currency: "USD", flag: "🇸🇨" },
    {
      country: "SIERRA LEONE",
      language: "English",
      currency: "USD",
      flag: "🇸🇱",
    },
    { country: "SOMALIA", language: "English", currency: "USD", flag: "🇸🇴" },
    {
      country: "SOUTH AFRICA",
      language: "English",
      currency: "ZAR",
      flag: "🇿🇦",
    },
    {
      country: "SOUTH SUDAN",
      language: "English",
      currency: "USD",
      flag: "🇸🇸",
    },
    { country: "SUDAN", language: "English", currency: "USD", flag: "🇸🇩" },
    { country: "TANZANIA", language: "English", currency: "USD", flag: "🇹🇿" },
    { country: "TOGO", language: "Français", currency: "USD", flag: "🇹🇬" },
    { country: "TUNISIA", language: "English", currency: "USD", flag: "🇹🇳" },
    { country: "UGANDA", language: "English", currency: "USD", flag: "🇺🇬" },
    { country: "ZAMBIA", language: "English", currency: "USD", flag: "🇿🇲" },
    { country: "ZIMBABWE", language: "English", currency: "USD", flag: "🇿🇼" },
  ],
  OCEANIA: [
    { country: "AUSTRALIA", language: "English", currency: "AUD", flag: "🇦🇺" },
    { country: "FIJI", language: "English", currency: "USD", flag: "🇫🇯" },
    {
      country: "NEW ZEALAND",
      language: "English",
      currency: "NZD",
      flag: "🇳🇿",
    },
    {
      country: "PAPUA NEW GUINEA",
      language: "English",
      currency: "USD",
      flag: "🇵🇬",
    },
  ],
  "SOUTH AMERICA": [
    { country: "ARGENTINA", language: "Español", currency: "ARS", flag: "🇦🇷" },
    { country: "BOLIVIA", language: "Español", currency: "USD", flag: "🇧🇴" },
    { country: "BRAZIL", language: "Português", currency: "BRL", flag: "🇧🇷" },
    { country: "CHILE", language: "Español", currency: "USD", flag: "🇨🇱" },
    { country: "COLOMBIA", language: "Español", currency: "USD", flag: "🇨🇴" },
    { country: "ECUADOR", language: "Español", currency: "USD", flag: "🇪🇨" },
    {
      country: "FRENCH GUIANA",
      language: "Français",
      currency: "EUR",
      flag: "🇬🇫",
    },
    { country: "GUYANA", language: "English", currency: "USD", flag: "🇬🇾" },
    { country: "PARAGUAY", language: "Español", currency: "USD", flag: "🇵🇾" },
    { country: "PERU", language: "Español", currency: "USD", flag: "🇵🇪" },
    { country: "SURINAME", language: "English", currency: "USD", flag: "🇸🇷" },
    { country: "URUGUAY", language: "Español", currency: "USD", flag: "🇺🇾" },
    { country: "VENEZUELA", language: "Español", currency: "USD", flag: "🇻🇪" },
  ],
};

export default function LanguageCurrencyPage() {
  const router = useRouter();
  const currentLocale = useLocale();
  const t = useTranslations("languageCurrency");

  const { selectedCurrency, currencies, isLoading, error, setCurrency } =
    useCurrency();

  const [selectedCountry, setSelectedCountry] =
    useState<CountryCurrency | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCountrySelect = (country: CountryCurrency) => {
    setSelectedCountry(country);

    // Find the currency in our currencies list and set it
    const currency = currencies.find((c) => c.code === country.currency);
    if (currency) {
      setCurrency(currency);
    } else {
      // If currency not found in list, create a basic currency object
      const basicCurrency = {
        code: country.currency,
        name: `${country.currency} Currency`,
        symbol: country.currency,
        flag: country.flag,
        rate: 1, // Default rate, will be updated when API loads
      };
      setCurrency(basicCurrency);
    }
  };

  const handleSaveSettings = () => {
    router.back();
  };

  // Filter countries based on search query
  const filterCountries = (countries: CountryCurrency[]) => {
    if (!searchQuery.trim()) return countries;

    const query = searchQuery.toLowerCase().trim();
    return countries.filter(
      (country) =>
        country.country.toLowerCase().includes(query) ||
        country.currency.toLowerCase().includes(query) ||
        country.language.toLowerCase().includes(query)
    );
  };

  // Filter regions based on search - only show regions that have matching countries
  const getFilteredRegions = () => {
    if (!searchQuery.trim()) return COUNTRIES_BY_REGION;

    const filteredRegions: Record<string, CountryCurrency[]> = {};

    Object.entries(COUNTRIES_BY_REGION).forEach(([regionName, countries]) => {
      const filteredCountries = filterCountries(countries);
      if (filteredCountries.length > 0) {
        filteredRegions[regionName] = filteredCountries;
      }
    });

    return filteredRegions;
  };

  // Highlight matching text in search results
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-dark rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="secondary"
                onClick={() => router.back()}
                className="p-3 mr-4 bg-gray-100 hover:bg-gray-200 border-gray-300"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <h1 className="text-[16px] font-unbounded font-bold text-dark">
                {t("content.title")}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Column - Countries List */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    t("content.searchPlaceholder") ||
                    "Search countries, currencies..."
                  }
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white text-dark placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="mt-2 text-sm text-gray-600">
                  {t("content.searchResults") || "Search results for"}: "
                  {searchQuery}"
                  {Object.values(getFilteredRegions()).flat().length > 0 && (
                    <span className="ml-2 text-blue font-medium">
                      ({Object.values(getFilteredRegions()).flat().length}{" "}
                      {Object.values(getFilteredRegions()).flat().length === 1
                        ? "result"
                        : "results"}
                      )
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Countries Grid by Regions */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-blue mr-3" />
                <span className="text-dark font-roboto">
                  {t("content.loadingRates")}
                </span>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(getFilteredRegions()).length === 0 ? (
                  <div className="text-center py-16">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-roboto font-medium text-gray-600 mb-2">
                      {t("content.noResults") || "No results found"}
                    </h3>
                    <p className="text-gray-500">
                      {t("content.noResultsDesc") ||
                        "Try searching with different keywords"}
                    </p>
                  </div>
                ) : (
                  Object.entries(getFilteredRegions()).map(
                    ([regionName, countries]) => (
                      <div key={regionName}>
                        <h2 className="text-2xl font-unbounded font-bold text-dark mb-6 uppercase">
                          {regionName}
                          <span className="text-sm font-roboto font-normal text-gray-500 ml-3 capitalize">
                            ({countries.length}{" "}
                            {countries.length === 1 ? "country" : "countries"})
                          </span>
                        </h2>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                          {countries.map((country) => {
                            const isSelected =
                              selectedCountry?.country === country.country;
                            return (
                              <button
                                key={country.country}
                                onClick={() => handleCountrySelect(country)}
                                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                                  isSelected
                                    ? "border-blue bg-blue/5"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-lg">
                                    {country.flag}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <div
                                      className={`font-roboto font-medium text-xs truncate ${
                                        isSelected ? "text-blue" : "text-dark"
                                      }`}
                                    >
                                      {searchQuery
                                        ? highlightText(
                                            country.country,
                                            searchQuery
                                          )
                                        : country.country}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 mb-1">
                                  {searchQuery
                                    ? highlightText(
                                        country.language,
                                        searchQuery
                                      )
                                    : country.language}
                                </div>
                                <div
                                  className={`text-xs font-medium ${
                                    isSelected ? "text-blue" : "text-gray-700"
                                  }`}
                                >
                                  {searchQuery
                                    ? highlightText(
                                        country.currency,
                                        searchQuery
                                      )
                                    : country.currency}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            )}
          </div>

          {/* Right Column - Settings Panel */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-[128px] z-40 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-dark font-roboto font-medium mb-4">
                {t("content.title")}
              </h3>

              {/* Selected Country Display */}
              {selectedCountry && (
                <div className="mb-4 flex items-center gap-3 text-dark">
                  <span className="text-2xl">{selectedCountry.flag}</span>
                  <div>
                    <div className="font-medium">{selectedCountry.country}</div>
                    <div className="text-sm text-gray-600">
                      {selectedCountry.language}
                    </div>
                  </div>
                </div>
              )}

              {/* Language Selector */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-dark mb-2">
                  <span className="text-xl">🌐</span>
                  <span className="font-roboto">
                    {currentLocale === "ru" ? "Русский" : "English"}
                  </span>
                </div>
              </div>

              {/* Currency Selector */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-dark mb-2">
                  <span className="text-xl">💵</span>
                  <span className="font-roboto">
                    {selectedCurrency.code} ({selectedCurrency.symbol})
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSaveSettings}
                className="w-full bg-blue hover:bg-blue/90 text-white py-3 rounded-lg font-roboto font-medium"
              >
                {t("content.saveSettings")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
