"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/entities/currency/hooks/use-currency";
import type { Currency } from "@/entities/currency/model/currency-types";

export function CurrencySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selectedCurrency, availableCurrencies, updateCurrency, isLoading } =
    useCurrency();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const handleCurrencySelect = (currency: Currency) => {
    updateCurrency(currency);
    setIsOpen(false);
  };

  // Show top currencies first
  const sortedCurrencies = [...availableCurrencies].sort((a, b) => {
    const priority = ["RUB", "USD", "EUR", "BRL", "CNY", "TRY"];
    const aPriority = priority.indexOf(a.code);
    const bPriority = priority.indexOf(b.code);

    if (aPriority !== -1 && bPriority !== -1) {
      return aPriority - bPriority;
    }
    if (aPriority !== -1) return -1;
    if (bPriority !== -1) return 1;

    return a.code.localeCompare(b.code);
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          hidden md:flex items-center gap-1 bg-gray-100 hover:bg-gray-200 
          px-3 py-1.5 rounded-lg mr-2 transition-colors duration-200 
          cursor-pointer min-w-[80px] justify-center
          ${isOpen ? "bg-gray-200" : ""}
          ${isLoading ? "opacity-50" : ""}
        `}
        disabled={isLoading}
      >
        <span className="text-xs font-roboto font-medium text-gray-600">
          RUB/{selectedCurrency.code}
        </span>
        <span className="text-sm">{selectedCurrency.symbol}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
          <div className="py-2">
            {sortedCurrencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencySelect(currency)}
                className={`
                  w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150
                  flex items-center gap-3
                  ${
                    selectedCurrency.code === currency.code
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }
                `}
              >
                <span className="text-lg">{currency.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{currency.code}</span>
                    <span className="text-sm text-gray-500">
                      {currency.symbol}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {currency.name}
                  </div>
                </div>
                {selectedCurrency.code === currency.code && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
