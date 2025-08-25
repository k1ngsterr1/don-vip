"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
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
    { country: "RUSSIA", language: "Русский", currency: "RUB", flag: "🇷🇺" },
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

  // Hardcoded translations using conditional rendering
  const translations = {
    title: currentLocale === "ru" ? "Язык и валюта" : "Language and Currency",
    searchPlaceholder:
      currentLocale === "ru"
        ? "Поиск стран, валют..."
        : "Search countries, currencies...",
    searchResults:
      currentLocale === "ru" ? "Результаты поиска для" : "Search results for",
    loadingRates:
      currentLocale === "ru" ? "Загрузка курсов..." : "Loading rates...",
    noResults:
      currentLocale === "ru" ? "Результаты не найдены" : "No results found",
    noResultsDesc:
      currentLocale === "ru"
        ? "Попробуйте поиск с другими ключевыми словами"
        : "Try searching with different keywords",
    saveSettings:
      currentLocale === "ru" ? "Сохранить настройки" : "Save Settings",
    result: currentLocale === "ru" ? "результат" : "result",
    results: currentLocale === "ru" ? "результатов" : "results",
    country: currentLocale === "ru" ? "страна" : "country",
    countries: currentLocale === "ru" ? "стран" : "countries",
  };

  const {
    selectedCurrency,
    availableCurrencies,
    isLoading,
    error,
    updateCurrency,
  } = useCurrency();

  const [selectedCountry, setSelectedCountry] =
    useState<CountryCurrency | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCountrySelect = (country: CountryCurrency) => {
    setSelectedCountry(country);

    // Find the currency in our currencies list and set it
    const currency = availableCurrencies.find(
      (c) => c.code === country.currency
    );
    if (currency) {
      updateCurrency(currency);
    } else {
      // If currency not found in list, create a basic currency object
      const basicCurrency = {
        code: country.currency,
        name: `${country.currency} Currency`,
        symbol: country.currency,
        flag: country.flag,
        rate: 1, // Default rate, will be updated when API loads
      };
      updateCurrency(basicCurrency);
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
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
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
                {translations.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Countries List */}
          <div className="flex-1 order-2 lg:order-1">
            {/* Search Bar */}
            <div className="mb-4 md:mb-8">
              <div className="relative max-w-full md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={translations.searchPlaceholder}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white text-dark placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent text-sm md:text-base"
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
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-blue mr-3" />
                <span className="text-dark font-roboto">
                  {translations.loadingRates}
                </span>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(getFilteredRegions()).length === 0 ? (
                  <div className="text-center py-16">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-roboto font-medium text-gray-600 mb-2">
                      {translations.noResults}
                    </h3>
                    <p className="text-gray-500">
                      {translations.noResultsDesc}
                    </p>
                  </div>
                ) : (
                  Object.entries(getFilteredRegions()).map(
                    ([regionName, countries]) => (
                      <div key={regionName}>
                        <h2 className="text-lg md:text-2xl font-unbounded font-bold text-dark mb-4 md:mb-6 uppercase">
                          {regionName}
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
                                className={`p-2 md:p-3 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                                  isSelected
                                    ? "border-blue bg-blue/5"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <div className="flex items-center gap-1 md:gap-2 mb-1">
                                  <span className="text-sm md:text-lg">
                                    {country.flag}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <div
                                      className={`font-roboto font-medium text-[10px] md:text-xs truncate ${
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
                                <div className="text-[9px] md:text-xs text-gray-500 mb-1">
                                  {searchQuery
                                    ? highlightText(
                                        country.language,
                                        searchQuery
                                      )
                                    : country.language}
                                </div>
                                <div
                                  className={`text-[9px] md:text-xs font-medium ${
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

          {/* Settings Panel */}
          <div className="w-full lg:w-80 flex-shrink-0 order-1 lg:order-2">
            <div className="lg:sticky lg:top-[128px] z-40 bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-lg">
              <h3 className="text-dark font-roboto font-medium mb-4 text-sm md:text-base">
                {translations.title}
              </h3>

              {/* Selected Country Display */}
              {selectedCountry && (
                <div className="mb-4 flex items-center gap-2 md:gap-3 text-dark">
                  <span className="text-xl md:text-2xl">{selectedCountry.flag}</span>
                  <div>
                    <div className="font-medium text-sm md:text-base">{selectedCountry.country}</div>
                    <div className="text-xs md:text-sm text-gray-600">
                      {selectedCountry.language}
                    </div>
                  </div>
                </div>
              )}

              {/* Language Selector */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-dark mb-2">
                  <span className="text-lg md:text-xl">🌐</span>
                  <span className="font-roboto text-sm md:text-base">
                    {currentLocale === "ru" ? "Русский" : "English"}
                  </span>
                </div>
              </div>

              {/* Currency Selector */}
              <div className="mb-4 md:mb-6">
                <div className="flex items-center gap-2 text-dark mb-2">
                  <span className="text-lg md:text-xl">💵</span>
                  <span className="font-roboto text-sm md:text-base">
                    {selectedCurrency.code} ({selectedCurrency.symbol})
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSaveSettings}
                className="w-full bg-blue hover:bg-blue/90 text-white py-2 md:py-3 rounded-lg font-roboto font-medium text-sm md:text-base"
              >
                {translations.saveSettings}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
