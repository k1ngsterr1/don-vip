"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCurrency } from "@/entities/currency/hooks/use-currency";
import { useLanguageStore } from "@/shared/stores";
import { Button } from "@/shared/ui/button/button";
import { ArrowLeft, Loader2, Search, X } from "lucide-react";

interface CountryCurrency {
  country: string;
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
    { country: "AUSTRIA", currency: "EUR", flag: "🇦🇹" },
    { country: "BELGIUM", currency: "EUR", flag: "🇧🇪" },
    { country: "CYPRUS", currency: "EUR", flag: "🇨🇾" },
    { country: "ESTONIA", currency: "EUR", flag: "🇪🇪" },
    { country: "FINLAND", currency: "EUR", flag: "🇫🇮" },
    { country: "FRANCE", currency: "EUR", flag: "🇫🇷" },
    { country: "GERMANY", currency: "EUR", flag: "🇩🇪" },
    { country: "GREECE", currency: "EUR", flag: "🇬🇷" },
    { country: "HUNGARY", currency: "HUF", flag: "🇭🇺" },
    { country: "IRELAND", currency: "EUR", flag: "🇮🇪" },
    { country: "ITALY", currency: "EUR", flag: "🇮🇹" },
    { country: "LATVIA", currency: "EUR", flag: "🇱🇻" },
    { country: "LITHUANIA", currency: "EUR", flag: "🇱🇹" },
    { country: "LUXEMBOURG", currency: "EUR", flag: "🇱🇺" },
    { country: "MALTA", currency: "EUR", flag: "🇲🇹" },
    { country: "NETHERLANDS", currency: "EUR", flag: "🇳🇱" },
    { country: "PORTUGAL", currency: "EUR", flag: "🇵🇹" },
    { country: "SLOVAKIA", currency: "EUR", flag: "🇸🇰" },
    { country: "SLOVENIA", currency: "EUR", flag: "🇸🇮" },
    { country: "SPAIN", currency: "EUR", flag: "🇪🇸" },
  ],
  ASIA: [
    { country: "RUSSIA", currency: "RUB", flag: "🇷🇺" },
    { country: "KAZAKHSTAN", currency: "KZT", flag: "🇰🇿" },
  ],
};

export default function LanguageCurrencyPage() {
  const router = useRouter();
  const currentLocale = useLocale();
  const t = useTranslations("languageCurrency");

  // Hardcoded translations using useLocale
  const translations = {
    currencyTitle:
      currentLocale === "ru" ? "Выберите свою валюту" : "Select your currency",
    searchPlaceholder:
      currentLocale === "ru"
        ? "Поиск стран, валют..."
        : "Search countries, currencies...",
    searchResults:
      currentLocale === "ru" ? "Результаты поиска для" : "Search results for",
    noResults:
      currentLocale === "ru" ? "Результаты не найдены" : "No results found",
    noResultsDesc:
      currentLocale === "ru"
        ? "Попробуйте поискать по другим ключевым словам"
        : "Try searching with different keywords",
    loadingRates:
      currentLocale === "ru"
        ? "Загрузка курсов валют..."
        : "Loading exchange rates...",
    result: currentLocale === "ru" ? "результат" : "result",
    results: currentLocale === "ru" ? "результатов" : "results",
    country: currentLocale === "ru" ? "страна" : "country",
    countries: currentLocale === "ru" ? "стран" : "countries",
  };

  const { selectedCurrency, currencies, isLoading, error, setCurrency } =
    useCurrency();

  // Zustand store for currency settings
  const { selectedCountry, setSelectedCountry } = useLanguageStore();

  const [searchQuery, setSearchQuery] = useState("");

  const handleCountrySelect = (country: CountryCurrency) => {
    setSelectedCountry(country);

    // Find the currency in our currencies list and set it
    const currency = currencies.find((c) => c.code === country.currency);
    if (currency) {
      setCurrency(currency);
      // Save currency and immediately redirect to home
      localStorage.setItem("selectedCurrency", JSON.stringify(currency));
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
      // Save currency and immediately redirect to home
      localStorage.setItem("selectedCurrency", JSON.stringify(basicCurrency));
    }

    // Immediately redirect to home and reload
    const homePath = `/${currentLocale}`;
    router.push(homePath);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  const handleSaveSettings = () => {
    // Auto-save functionality moved to handleCountrySelect
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
        country.currency.toLowerCase().includes(query)
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
    <div className="min-h-screen bg-white pb-8">
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
                {translations.currencyTitle}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8">
        <div className="flex flex-col">
          {/* Countries List */}
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
                  placeholder={translations.searchPlaceholder}
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
                  {translations.searchResults}: "{searchQuery}"
                  {Object.values(getFilteredRegions()).flat().length > 0 && (
                    <span className="ml-2 text-blue font-medium">
                      ({Object.values(getFilteredRegions()).flat().length}{" "}
                      {Object.values(getFilteredRegions()).flat().length === 1
                        ? translations.result
                        : translations.results}
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
                  {translations.loadingRates}
                </span>
              </div>
            ) : (
              <div className="space-y-8 md:space-y-12">
                {Object.entries(getFilteredRegions()).length === 0 ? (
                  <div className="text-center py-12 md:py-16">
                    <Search className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg md:text-xl font-roboto font-medium text-gray-600 mb-2">
                      {translations.noResults}
                    </h3>
                    <p className="text-sm md:text-base text-gray-500">
                      {translations.noResultsDesc}
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
                            {countries.length === 1
                              ? translations.country
                              : translations.countries}
                            )
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
                                <div className="flex items-center gap-1.5 md:gap-2 mb-2">
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
        </div>
      </div>
    </div>
  );
}
