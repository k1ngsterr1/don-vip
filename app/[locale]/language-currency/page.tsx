"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCurrency } from "@/entities/currency/hooks/use-currency";
import { useLanguageStore } from "@/shared/stores";
import { Button } from "@/shared/ui/button/button";
import { ArrowLeft, Loader2, Search, X } from "lucide-react";
import { Link } from "@/i18n/routing";

interface CountryCurrency {
  country: string;
  language: string;
  currency: string;
  flag: string;
}

// Region names localization
const REGION_TRANSLATIONS = {
  EUROPE: {
    ru: "ЕВРОПА",
    en: "EUROPE",
  },
  ASIA: {
    ru: "АЗИЯ",
    en: "ASIA",
  },
  "NORTH AMERICA": {
    ru: "СЕВЕРНАЯ АМЕРИКА",
    en: "NORTH AMERICA",
  },
  "SOUTH AMERICA": {
    ru: "ЮЖНАЯ АМЕРИКА",
    en: "SOUTH AMERICA",
  },
  OCEANIA: {
    ru: "ОКЕАНИЯ",
    en: "OCEANIA",
  },
};

// Countries with their currencies organized by regions like SEAGM
const COUNTRIES_BY_REGION = {
  EUROPE: [
    { country: "RUSSIA", language: "Русский", currency: "RUB", flag: "🇷🇺" },
    { country: "AUSTRIA", language: "Deutsch", currency: "EUR", flag: "🇦🇹" },
    { country: "BELGIUM", language: "Français", currency: "EUR", flag: "🇧🇪" },
    { country: "BULGARIA", language: "Български", currency: "BGN", flag: "🇧🇬" },
    { country: "CROATIA", language: "Hrvatski", currency: "HRK", flag: "🇭🇷" },
    { country: "CYPRUS", language: "Ελληνικά", currency: "EUR", flag: "🇨🇾" },
    {
      country: "CZECH REPUBLIC",
      language: "Čeština",
      currency: "CZK",
      flag: "🇨🇿",
    },
    { country: "DENMARK", language: "Dansk", currency: "DKK", flag: "🇩🇰" },
    { country: "ESTONIA", language: "Eesti", currency: "EUR", flag: "🇪🇪" },
    { country: "FINLAND", language: "Suomi", currency: "EUR", flag: "🇫🇮" },
    { country: "FRANCE", language: "Français", currency: "EUR", flag: "🇫🇷" },
    { country: "GERMANY", language: "Deutsch", currency: "EUR", flag: "🇩🇪" },
    { country: "GREECE", language: "Ελληνικά", currency: "EUR", flag: "🇬🇷" },
    { country: "HUNGARY", language: "Magyar", currency: "HUF", flag: "🇭🇺" },
    { country: "IRELAND", language: "English", currency: "EUR", flag: "🇮🇪" },
    { country: "ITALY", language: "Italiano", currency: "EUR", flag: "🇮🇹" },
    { country: "LATVIA", language: "Latviešu", currency: "EUR", flag: "🇱🇻" },
    { country: "LITHUANIA", language: "Lietuvių", currency: "EUR", flag: "🇱🇹" },
    {
      country: "LUXEMBOURG",
      language: "Français",
      currency: "EUR",
      flag: "🇱🇺",
    },
    { country: "MALTA", language: "English", currency: "EUR", flag: "🇲🇹" },
    {
      country: "NETHERLANDS",
      language: "Nederlands",
      currency: "EUR",
      flag: "🇳🇱",
    },
    { country: "NORWAY", language: "Norsk", currency: "NOK", flag: "🇳🇴" },
    { country: "POLAND", language: "Polski", currency: "PLN", flag: "🇵🇱" },
    { country: "PORTUGAL", language: "Português", currency: "EUR", flag: "🇵🇹" },
    { country: "ROMANIA", language: "Română", currency: "RON", flag: "🇷🇴" },
    {
      country: "SLOVAKIA",
      language: "Slovenčina",
      currency: "EUR",
      flag: "🇸🇰",
    },
    {
      country: "SLOVENIA",
      language: "Slovenščina",
      currency: "EUR",
      flag: "🇸🇮",
    },
    { country: "SPAIN", language: "Español", currency: "EUR", flag: "🇪🇸" },
    { country: "SWEDEN", language: "Svenska", currency: "SEK", flag: "🇸🇪" },
    {
      country: "SWITZERLAND",
      language: "Deutsch",
      currency: "CHF",
      flag: "🇨🇭",
    },
    { country: "UKRAINE", language: "Українська", currency: "UAH", flag: "🇺🇦" },
    {
      country: "UNITED KINGDOM",
      language: "English",
      currency: "GBP",
      flag: "🇬🇧",
    },
  ],
  ASIA: [
    { country: "KAZAKHSTAN", language: "Русский", currency: "KZT", flag: "🇰🇿" },
    { country: "CHINA", language: "中文", currency: "CNY", flag: "🇨🇳" },
    { country: "JAPAN", language: "日本語", currency: "JPY", flag: "🇯🇵" },
    { country: "SOUTH KOREA", language: "한국어", currency: "KRW", flag: "🇰🇷" },
    { country: "SINGAPORE", language: "English", currency: "SGD", flag: "🇸🇬" },
    { country: "THAILAND", language: "ไทย", currency: "THB", flag: "🇹🇭" },
    {
      country: "MALAYSIA",
      language: "Bahasa Malaysia",
      currency: "MYR",
      flag: "🇲🇾",
    },
    { country: "INDIA", language: "हिन्दी", currency: "INR", flag: "🇮🇳" },
    { country: "HONG KONG", language: "English", currency: "HKD", flag: "🇭🇰" },
    { country: "TAIWAN", language: "中文", currency: "TWD", flag: "🇹🇼" },
    { country: "VIETNAM", language: "Tiếng Việt", currency: "VND", flag: "🇻🇳" },
    {
      country: "INDONESIA",
      language: "Bahasa Indonesia",
      currency: "IDR",
      flag: "🇮🇩",
    },
  ],

  "NORTH AMERICA": [
    {
      country: "UNITED STATES",
      language: "English",
      currency: "USD",
      flag: "🇺🇸",
    },
    { country: "CANADA", language: "English", currency: "CAD", flag: "🇨🇦" },
    { country: "MEXICO", language: "Español", currency: "MXN", flag: "🇲🇽" },
  ],

  "SOUTH AMERICA": [
    { country: "BRAZIL", language: "Português", currency: "BRL", flag: "🇧🇷" },
    { country: "ARGENTINA", language: "Español", currency: "ARS", flag: "��" },
    { country: "CHILE", language: "Español", currency: "USD", flag: "🇨�" },
    { country: "COLOMBIA", language: "Español", currency: "USD", flag: "��" },
    { country: "PERU", language: "Español", currency: "USD", flag: "🇵🇪" },
    { country: "URUGUAY", language: "Español", currency: "USD", flag: "🇺🇾" },
    { country: "VENEZUELA", language: "Español", currency: "USD", flag: "🇻🇪" },
  ],

  OCEANIA: [
    { country: "AUSTRALIA", language: "English", currency: "AUD", flag: "🇦🇺" },
    {
      country: "NEW ZEALAND",
      language: "English",
      currency: "NZD",
      flag: "🇳🇿",
    },
  ],
};

export default function LanguageCurrencyPage() {
  const router = useRouter();
  const currentLocale = useLocale();
  const t = useTranslations("languageCurrency");

  const { selectedCurrency, currencies, isLoading, error, setCurrency } =
    useCurrency();

  // Zustand store for language settings
  const {
    selectedLocale,
    selectedCountry,
    setSelectedLocale,
    setSelectedCountry,
  } = useLanguageStore();

  const [searchQuery, setSearchQuery] = useState("");

  // Initialize store with current locale on mount
  useEffect(() => {
    if (!selectedLocale || selectedLocale !== currentLocale) {
      setSelectedLocale(currentLocale);
    }
  }, [currentLocale, selectedLocale, setSelectedLocale]);

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

  const handleLanguageChange = (newLocale: string) => {
    setSelectedLocale(newLocale);
  };

  const handleSaveSettings = () => {
    if (selectedCurrency) {
      localStorage.setItem(
        "selectedCurrency",
        JSON.stringify(selectedCurrency)
      );
    }

    // Language and country are already persisted in Zustand store

    // Check if language was changed and redirect with new locale
    if (selectedLocale !== currentLocale) {
      // Redirect to home page with new locale and reload
      const newPath = `/${selectedLocale}`;
      window.location.href = newPath;
    } else {
      // Force page reload to apply settings and go back
      window.location.reload();
    }
  };

  // Get localized region name
  const getLocalizedRegionName = (regionKey: string) => {
    return (
      REGION_TRANSLATIONS[regionKey as keyof typeof REGION_TRANSLATIONS]?.[
        currentLocale as "ru" | "en"
      ] || regionKey
    );
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
    <div className="min-h-screen bg-white pb-32 md:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="secondary"
                onClick={() => router.back()}
                className="p-2 md:p-3 mr-3 md:mr-4 bg-gray-100 hover:bg-gray-200 border-gray-300"
              >
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
              </Button>
              <h1 className="text-sm md:text-[16px] font-unbounded font-bold text-dark">
                {t("content.title")}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8">
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
          {/* Left Column - Countries List */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6 md:mb-8">
              <div className="relative max-w-full md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    t("content.searchPlaceholder") ||
                    "Search countries, currencies..."
                  }
                  className="block w-full pl-10 pr-10 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-dark placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700"
                  >
                    <X className="h-4 w-4 md:h-5 md:w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="mt-2 text-xs md:text-sm text-gray-600">
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
              <div className="flex items-center justify-center py-12 md:py-16">
                <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-blue mr-3" />
                <span className="text-sm md:text-base text-dark font-roboto">
                  {t("content.loadingRates")}
                </span>
              </div>
            ) : (
              <div className="space-y-8 md:space-y-12">
                {Object.entries(getFilteredRegions()).length === 0 ? (
                  <div className="text-center py-12 md:py-16">
                    <Search className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg md:text-xl font-roboto font-medium text-gray-600 mb-2">
                      {t("content.noResults") || "No results found"}
                    </h3>
                    <p className="text-sm md:text-base text-gray-500">
                      {t("content.noResultsDesc") ||
                        "Try searching with different keywords"}
                    </p>
                  </div>
                ) : (
                  Object.entries(getFilteredRegions()).map(
                    ([regionName, countries]) => (
                      <div key={regionName}>
                        <h2 className="text-lg md:text-2xl font-unbounded font-bold text-dark mb-4 md:mb-6 uppercase">
                          {getLocalizedRegionName(regionName)}
                          <span className="text-xs md:text-sm font-roboto font-normal text-gray-500 ml-2 md:ml-3 capitalize">
                            ({countries.length}{" "}
                            {countries.length === 1 ? "country" : "countries"})
                          </span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
                          {countries.map((country) => {
                            const isSelected =
                              selectedCountry?.country === country.country;
                            return (
                              <button
                                key={country.country}
                                onClick={() => handleCountrySelect(country)}
                                className={`p-2.5 md:p-3 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                                  isSelected
                                    ? "border-blue bg-blue/5"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                                  <span className="text-base md:text-lg">
                                    {country.flag}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <div
                                      className={`font-roboto font-medium text-[10px] sm:text-xs truncate ${
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
                                <div className="text-[9px] sm:text-xs text-gray-500 mb-1">
                                  {searchQuery
                                    ? highlightText(
                                        country.language,
                                        searchQuery
                                      )
                                    : country.language}
                                </div>
                                <div
                                  className={`text-[10px] sm:text-xs font-medium ${
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
          <div className="w-full xl:w-80 xl:flex-shrink-0">
            {/* Mobile: Fixed bottom panel */}
            <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4">
              <div className="max-w-sm mx-auto">
                <h3 className="text-dark font-roboto font-medium mb-3 text-center">
                  {t("content.title")}
                </h3>

                {/* Selected Country Display */}
                {selectedCountry && (
                  <div className="mb-3 flex items-center justify-center gap-3 text-dark">
                    <span className="text-xl">{selectedCountry.flag}</span>
                    <div className="text-center">
                      <div className="font-medium text-sm">
                        {selectedCountry.country}
                      </div>
                      <div className="text-xs text-gray-600">
                        {selectedCountry.language}
                      </div>
                    </div>
                  </div>
                )}

                {/* Language Selector */}
                <div className="mb-3">
                  <div className="flex items-center justify-center gap-2 text-dark text-sm">
                    <span className="text-lg">🌐</span>
                    <span className="font-roboto">
                      {currentLocale === "ru" ? "Русский" : "English"}
                    </span>
                  </div>
                </div>

                {/* Currency Selector */}
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2 text-dark text-sm">
                    <span className="text-lg">💵</span>
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

            {/* Desktop/Tablet: Sticky sidebar */}
            <div className="hidden xl:block">
              <div className="sticky top-[128px] z-40 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <h3 className="text-dark font-roboto font-medium mb-4">
                  {t("content.title")}
                </h3>

                {/* Selected Country Display */}
                {selectedCountry && (
                  <div className="mb-4 flex items-center gap-3 text-dark">
                    <span className="text-2xl">{selectedCountry.flag}</span>
                    <div>
                      <div className="font-medium">
                        {selectedCountry.country}
                      </div>
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
    </div>
  );
}
