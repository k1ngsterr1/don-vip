"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCurrency } from "@/entities/currency/hooks/use-currency";
import { Button } from "@/shared/ui/button/button";
import {
  ArrowLeft,
  Check,
  Globe,
  DollarSign,
  Loader2,
  MapPin,
} from "lucide-react";

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface Region {
  name: string;
  currencies: string[];
}

const LANGUAGES: Language[] = [
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

// Group currencies by regions like SEAGM
const CURRENCY_REGIONS: Region[] = [
  {
    name: "EUROPE",
    currencies: ["EUR", "GBP", "CHF", "SEK", "NOK", "DKK", "PLN", "CZK"],
  },
  {
    name: "NORTH AMERICA",
    currencies: ["USD", "CAD"],
  },
  {
    name: "ASIA",
    currencies: [
      "CNY",
      "JPY",
      "KRW",
      "SGD",
      "HKD",
      "TWD",
      "THB",
      "MYR",
      "INR",
      "IDR",
      "VND",
    ],
  },
  {
    name: "OCEANIA",
    currencies: ["AUD", "NZD"],
  },
  {
    name: "OTHERS",
    currencies: ["RUB", "BRL", "MXN", "ARS", "ZAR", "TRY", "EGP"],
  },
];

export default function LanguageCurrencyPage() {
  const router = useRouter();
  const currentLocale = useLocale();
  const t = useTranslations("languageCurrency");

  const [selectedLanguage, setSelectedLanguage] = useState(currentLocale);
  const currencyHook = useCurrency();
  const { selectedCurrency, currencies, isLoading, error, setCurrency } =
    currencyHook || {
      selectedCurrency: {
        code: "RUB",
        name: "Российский рубль",
        symbol: "₽",
        flag: "🇷🇺",
        rate: 1,
      },
      currencies: [],
      isLoading: true,
      error: null,
      setCurrency: () => {},
    };

  const [activeView, setActiveView] = useState<
    "main" | "language" | "currency"
  >("main");

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setActiveView("main");

    // Redirect to new locale
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, "");
    router.push(`/${languageCode}${pathWithoutLocale}`);
  };

  const handleCurrencyChange = (currency: typeof selectedCurrency) => {
    setCurrency(currency);
    setActiveView("main");
  };

  const handleSaveSettings = () => {
    // Settings are automatically saved when changed
    router.back();
  };

  const selectedLanguageData =
    LANGUAGES.find((lang) => lang.code === selectedLanguage) || LANGUAGES[0];

  // Get currencies by region for better organization
  const getCurrenciesByRegion = (regionCurrencies: string[]) => {
    return currencies.filter((currency) =>
      regionCurrencies.includes(currency.code)
    );
  };

  const renderMainView = () => (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-dark border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="secondary"
                onClick={() => router.back()}
                className="p-3 mr-4 bg-gray-800 hover:bg-gray-700 border-gray-700"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </Button>
              <h1 className="text-2xl font-unbounded font-bold text-white">
                {t("title", { defaultValue: "Выберите свой язык и валюту" })}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Current Selection Display */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-blue" />
              <span className="text-white font-roboto">
                {currentLocale === "ru" ? "ERITREA" : "ERITREA"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Current Language */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-blue mr-3" />
                <h3 className="text-lg font-roboto font-medium text-white">
                  {selectedLanguageData.flag} {selectedLanguageData.name}
                </h3>
              </div>
            </div>

            {/* Current Currency */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-blue mr-3" />
                <h3 className="text-lg font-roboto font-medium text-white">
                  {selectedCurrency.flag} {selectedCurrency.code}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
          <button
            onClick={() => setActiveView("language")}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-6 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-blue mr-4" />
                <div className="text-left">
                  <h3 className="text-lg font-roboto font-medium text-white mb-1">
                    {t("changeLanguage", { defaultValue: "Язык" })}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {selectedLanguageData.name}
                  </p>
                </div>
              </div>
              <ArrowLeft className="h-5 w-5 text-gray-400 transform rotate-180 group-hover:text-blue transition-colors" />
            </div>
          </button>

          <button
            onClick={() => setActiveView("currency")}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-6 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-blue mr-4" />
                <div className="text-left">
                  <h3 className="text-lg font-roboto font-medium text-white mb-1">
                    {t("changeCurrency", { defaultValue: "Валюта" })}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {selectedCurrency.code} ({selectedCurrency.symbol})
                  </p>
                </div>
              </div>
              <ArrowLeft className="h-5 w-5 text-gray-400 transform rotate-180 group-hover:text-blue transition-colors" />
            </div>
          </button>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <Button
            onClick={handleSaveSettings}
            className="bg-blue hover:bg-blue/90 text-white px-8 py-3 rounded-lg font-roboto font-medium text-lg min-w-[200px]"
          >
            {t("saveSettings", { defaultValue: "СОХРАНИТЬ НАСТРОЙКИ" })}
          </Button>
        </div>

        {/* Price Conversion Info */}
        {selectedCurrency.code !== "RUB" && (
          <div className="mt-12 bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-2xl mx-auto">
            <h3 className="font-roboto font-medium text-white mb-4 text-center">
              {t("priceExample", { defaultValue: "Пример цены" })}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">
                  {t("originalPrice", { defaultValue: "Цена в рублях" })}
                </div>
                <div className="font-roboto font-bold text-white text-lg">
                  100.00 ₽
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">
                  {t("convertedPrice", { defaultValue: "Ваша цена" })}
                </div>
                <div className="font-roboto font-bold text-blue text-lg">
                  {(100 / selectedCurrency.rate).toFixed(2)}{" "}
                  {selectedCurrency.symbol}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderLanguageView = () => (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-dark border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="secondary"
                onClick={() => setActiveView("main")}
                className="p-3 mr-4 bg-gray-800 hover:bg-gray-700 border-gray-700"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </Button>
              <h1 className="text-2xl font-unbounded font-bold text-white">
                {t("selectLanguage", { defaultValue: "Выберите язык" })}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-3 max-w-md mx-auto">
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                selectedLanguage === language.code
                  ? "bg-blue/10 border-blue text-blue"
                  : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-4">{language.flag}</span>
                <span className="font-roboto font-medium">{language.name}</span>
              </div>
              {selectedLanguage === language.code && (
                <Check className="h-5 w-5 text-blue" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrencyView = () => (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-dark border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="secondary"
                onClick={() => setActiveView("main")}
                className="p-3 mr-4 bg-gray-800 hover:bg-gray-700 border-gray-700"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </Button>
              <h1 className="text-2xl font-unbounded font-bold text-white">
                {t("selectCurrency", { defaultValue: "Выберите валюту" })}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue mr-3" />
            <span className="text-white font-roboto">
              {t("loadingRates", { defaultValue: "Загрузка курсов валют..." })}
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-red-500 font-roboto text-lg mb-4">
              {t("errorLoadingRates", {
                defaultValue: "Ошибка загрузки курсов валют",
              })}
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue hover:bg-blue/90 text-white px-6 py-2 rounded-lg"
            >
              {t("tryAgain", { defaultValue: "Попробовать снова" })}
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {CURRENCY_REGIONS.map((region) => {
              const regionCurrencies = getCurrenciesByRegion(region.currencies);

              if (regionCurrencies.length === 0) return null;

              return (
                <div key={region.name}>
                  <h2 className="text-xl font-unbounded font-bold text-white mb-4 uppercase">
                    {region.name}
                  </h2>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {regionCurrencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => handleCurrencyChange(currency)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                          selectedCurrency.code === currency.code
                            ? "bg-blue/10 border-blue"
                            : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-2xl mr-4">{currency.flag}</span>
                          <div className="text-left">
                            <div
                              className={`font-roboto font-medium ${
                                selectedCurrency.code === currency.code
                                  ? "text-blue"
                                  : "text-white"
                              }`}
                            >
                              {currency.code}
                            </div>
                            <div className="text-sm text-gray-400 truncate max-w-[150px]">
                              {currency.name}
                            </div>
                            {currency.code !== "RUB" && (
                              <div className="text-xs text-gray-500">
                                1 {currency.code} = {currency.rate.toFixed(2)} ₽
                              </div>
                            )}
                          </div>
                        </div>
                        {selectedCurrency.code === currency.code && (
                          <Check className="h-5 w-5 text-blue flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // Render different views based on activeView state
  switch (activeView) {
    case "language":
      return renderLanguageView();
    case "currency":
      return renderCurrencyView();
    default:
      return renderMainView();
  }
}
