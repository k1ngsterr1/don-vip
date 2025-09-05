"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import {
  EUROPEAN_COUNTRIES,
  EUROZONE_COUNTRIES,
} from "../model/european-currencies";
import { convertEuropeanCountriesToCurrencies } from "../utils/european-currency-utils";
import type { Currency } from "../model/currency-types";

interface EuropeanCurrencySelectorProps {
  selectedCurrency?: Currency;
  onCurrencySelect?: (currency: Currency) => void;
  showEurozoneOnly?: boolean;
  className?: string;
}

export function EuropeanCurrencySelector({
  selectedCurrency,
  onCurrencySelect,
  showEurozoneOnly = false,
  className = "",
}: EuropeanCurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const availableCurrencies = convertEuropeanCountriesToCurrencies();
  const filteredCurrencies = showEurozoneOnly
    ? availableCurrencies.filter((currency) => currency.code === "EUR")
    : availableCurrencies;

  const handleCurrencySelect = (currency: Currency) => {
    onCurrencySelect?.(currency);
    setIsOpen(false);
  };

  const currentCurrency = selectedCurrency || filteredCurrencies[0];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{currentCurrency.flag}</span>
          <div className="text-left">
            <div className="font-medium text-gray-900">
              {currentCurrency.code}
            </div>
            <div className="text-sm text-gray-500">{currentCurrency.name}</div>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            {filteredCurrencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencySelect(currency)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{currency.flag}</span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {currency.code}
                    </div>
                    <div className="text-sm text-gray-500">{currency.name}</div>
                  </div>
                </div>
                {currentCurrency.code === currency.code && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Группированный селектор валют для Европы
 * Показывает еврозону отдельно от других европейских валют
 */
export function GroupedEuropeanCurrencySelector({
  selectedCurrency,
  onCurrencySelect,
  className = "",
}: EuropeanCurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const eurozoneCountries = EUROZONE_COUNTRIES;
  const nonEurozoneCountries = EUROPEAN_COUNTRIES.filter(
    (country) => !eurozoneCountries.some((ez) => ez.code === country.code)
  );

  const euroCurrency: Currency = {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    rate: 0.01,
  };

  const otherCurrencies = convertEuropeanCountriesToCurrencies().filter(
    (currency) => currency.code !== "EUR"
  );

  const handleCurrencySelect = (currency: Currency) => {
    onCurrencySelect?.(currency);
    setIsOpen(false);
  };

  const currentCurrency = selectedCurrency || euroCurrency;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{currentCurrency.flag}</span>
          <div className="text-left">
            <div className="font-medium text-gray-900">
              {currentCurrency.code}
            </div>
            <div className="text-sm text-gray-500">{currentCurrency.name}</div>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            {/* Еврозона */}
            <div className="border-b border-gray-100">
              <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Еврозона ({eurozoneCountries.length} стран)
              </div>
              <button
                onClick={() => handleCurrencySelect(euroCurrency)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{euroCurrency.flag}</span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {euroCurrency.code}
                    </div>
                    <div className="text-sm text-gray-500">
                      {euroCurrency.name}
                    </div>
                  </div>
                </div>
                {currentCurrency.code === euroCurrency.code && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </button>
            </div>

            {/* Другие европейские валюты */}
            <div>
              <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Другие европейские валюты
              </div>
              {otherCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencySelect(currency)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors last:rounded-b-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{currency.flag}</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {currency.code}
                      </div>
                      <div className="text-sm text-gray-500">
                        {currency.name}
                      </div>
                    </div>
                  </div>
                  {currentCurrency.code === currency.code && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
