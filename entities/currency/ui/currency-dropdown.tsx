"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useCurrency } from "../hooks/use-currency";
import { ChevronDown } from "lucide-react";

interface CurrencyDropdownProps {
  className?: string;
  compact?: boolean;
}

export function CurrencyDropdown({
  className = "",
  compact = false,
}: CurrencyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const { selectedCurrency, currencies, setCurrency, isLoading } =
    useCurrency();

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <div
        className={`animate-pulse bg-gray-200 rounded px-3 py-2 ${className}`}
      >
        <div className="w-12 h-4"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 
          hover:border-gray-300 transition-colors bg-white
          ${compact ? "text-sm" : ""}
        `}
      >
        <span className="text-lg">{selectedCurrency.flag}</span>
        {!compact && (
          <span className="font-medium">{selectedCurrency.code}</span>
        )}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg border border-gray-200 shadow-lg z-50 max-h-64 overflow-y-auto">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => {
                setCurrency(currency);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 
                first:rounded-t-lg last:rounded-b-lg transition-colors
                ${
                  selectedCurrency.code === currency.code
                    ? "bg-blue-50 text-blue-600"
                    : ""
                }
              `}
            >
              <span className="text-lg">{currency.flag}</span>
              <div className="flex-1">
                <div className="font-medium">{currency.code}</div>
                {!compact && (
                  <div className="text-sm text-gray-500 truncate">
                    {currency.name}
                  </div>
                )}
                {currency.code !== "RUB" && (
                  <div className="text-xs text-gray-400">
                    1 {currency.code} = {currency.rate.toFixed(2)} ₽
                  </div>
                )}
              </div>
              {selectedCurrency.code === currency.code && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}

          <div className="border-t border-gray-100 p-3">
            <a
              href="/language-currency"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              onClick={() => setIsOpen(false)}
            >
              <span>⚙️</span>
              <span>
                {locale === "ru" ? "Настройки валюты" : "Currency Settings"}
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
