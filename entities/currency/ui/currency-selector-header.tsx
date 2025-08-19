"use client";

import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/entities/currency/hooks/use-currency";
import { Link } from "@/i18n/routing";

export function CurrencySelector() {
  const { selectedCurrency, isLoading } = useCurrency();

  return (
    <div className="relative">
      {/* Main currency button - click to go to currency page */}
      <Link href="/language-currency" className="block">
        <button
          className={`
            hidden md:flex items-center gap-1 bg-gray-100 hover:bg-gray-200 
            px-3 py-1.5 rounded-lg mr-2 transition-colors duration-200 
            cursor-pointer min-w-[80px] justify-center
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
            className="transition-transform duration-200"
          />
        </button>
      </Link>

      {/* Dropdown removed - button now navigates directly to currency page */}
    </div>
  );
}
