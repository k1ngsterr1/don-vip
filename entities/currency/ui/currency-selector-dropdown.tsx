"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "../hooks/use-currency";
import type { Currency } from "../model/currency-types";

interface CurrencySelectorDropdownProps {
  className?: string;
}

export function CurrencySelectorDropdown({
  className = "",
}: CurrencySelectorDropdownProps) {
  const { selectedCurrency, updateCurrency, availableCurrencies, isLoading } =
    useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCurrencySelect = (currency: Currency) => {
    updateCurrency(currency);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div
        className={`flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md animate-pulse ${className}`}
      >
        <div className="w-6 h-4 bg-gray-300 rounded"></div>
        <div className="w-8 h-4 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-lg">{selectedCurrency.flag}</span>
        <span className="font-medium text-sm">{selectedCurrency.code}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            {availableCurrencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencySelect(currency)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                  selectedCurrency.code === currency.code
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700"
                }`}
              >
                <span className="text-lg">{currency.flag}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{currency.code}</div>
                  <div className="text-xs text-gray-500">{currency.name}</div>
                </div>
                <span className="text-sm text-gray-400">{currency.symbol}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
