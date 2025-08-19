"use client";

import { useCurrency } from "../hooks/use-currency";

interface PriceDisplayProps {
  rubPrice: number;
  className?: string;
  showOriginal?: boolean;
}

export function PriceDisplay({
  rubPrice,
  className = "",
  showOriginal = false,
}: PriceDisplayProps) {
  const { selectedCurrency } = useCurrency();

  const convertedPrice =
    selectedCurrency.code === "RUB"
      ? rubPrice
      : rubPrice / selectedCurrency.rate;

  const formatPrice = (amount: number, symbol: string) => {
    const decimals =
      selectedCurrency.code === "JPY" || selectedCurrency.code === "KRW"
        ? 0
        : 2;
    return `${amount.toFixed(decimals)} ${symbol}`;
  };

  return (
    <div className={className}>
      <div className="font-semibold">
        {formatPrice(convertedPrice, selectedCurrency.symbol)}
      </div>
      {showOriginal && selectedCurrency.code !== "RUB" && (
        <div className="text-sm text-gray-500">
          ({formatPrice(rubPrice, "₽")})
        </div>
      )}
    </div>
  );
}
