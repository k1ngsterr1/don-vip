"use client";

import { cn } from "@/shared/utils/cn";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { CurrencyIcon } from "@/shared/ui/currency-icon";

interface Package {
  id: number;
  amount: number;
  price: string;
  originalPriceRub: number;
  type: string;
  sku: string;
  discount?: number;
  isPopular?: boolean;
  bonus?: number;
  discountPercent?: number;
  isDiscounted?: boolean;
}

interface CustomAmountSelectorProps {
  packages: Package[];
  onCustomAmountSelect: (amount: number, price: number) => void;
  currencyName: string;
  currencyImage: string;
  isActive: boolean;
  onReset: () => void;
}

export function CustomAmountSelector({
  packages,
  onCustomAmountSelect,
  currencyName,
  currencyImage,
  isActive,
  onReset,
}: CustomAmountSelectorProps) {
  const locale = useLocale();

  // Хардкодные переводы
  const translations = {
    title:
      locale === "ru"
        ? "Или укажите произвольное количество"
        : "Or specify custom amount",
    placeholder: locale === "ru" ? "Введите количество" : "Enter amount",
    calculate: locale === "ru" ? "Рассчитать" : "Calculate",
    pricePerUnit: locale === "ru" ? "Цена за единицу" : "Price per unit",
    totalPrice: locale === "ru" ? "Общая стоимость" : "Total price",
    minAmount: locale === "ru" ? "Минимальное количество" : "Minimum amount",
    forResellers: locale === "ru" ? "Для перепродавцов" : "For resellers",
    reset: locale === "ru" ? "Сбросить" : "Reset",
  };
  const [customAmount, setCustomAmount] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [pricePerUnit, setPricePerUnit] = useState<number | null>(null);

  // Вычисляем среднюю цену за единицу на основе существующих пакетов
  useEffect(() => {
    if (packages.length > 0) {
      // Берем несколько средних пакетов для расчета средней цены
      const middlePackages = packages
        .slice()
        .sort((a, b) => a.amount - b.amount)
        .slice(1, -1); // Исключаем самый маленький и самый большой

      if (middlePackages.length > 0) {
        const averagePrice =
          middlePackages.reduce((sum, pkg) => {
            const price = pkg.discountPercent
              ? pkg.originalPriceRub * (1 - pkg.discountPercent / 100)
              : parseFloat(pkg.price.replace(/[^\d.,]/g, "").replace(",", "."));
            return sum + price / pkg.amount;
          }, 0) / middlePackages.length;

        setPricePerUnit(averagePrice);
      }
    }
  }, [packages]);

  // Функция для получения fallback emoji в зависимости от типа валюты
  const getFallbackEmoji = (currencyName: string) => {
    const name = currencyName.toLowerCase();
    if (name.includes("diamond")) return "💎";
    if (name === "uc" || name.includes("uc") || name.includes("coins"))
      return "🪙";
    if (name.includes("gold")) return "🏆";
    if (name.includes("gem")) return "💎";
    if (name.includes("crystal")) return "💎";
    if (name.includes("service") || name.includes("услуга")) return "⚙️";
    return "🪙"; // Default fallback
  };

  const handleAmountChange = (value: string) => {
    // Разрешаем только цифры
    const numericValue = value.replace(/[^\d]/g, "");
    setCustomAmount(numericValue);

    if (numericValue && pricePerUnit) {
      const amount = parseInt(numericValue);
      const totalPrice = amount * pricePerUnit;
      setCalculatedPrice(totalPrice);
    } else {
      setCalculatedPrice(null);
    }
  };

  const handleCalculate = () => {
    if (customAmount && calculatedPrice && pricePerUnit) {
      const amount = parseInt(customAmount);
      if (amount > 0) {
        onCustomAmountSelect(amount, calculatedPrice);
      }
    }
  };

  const handleReset = () => {
    setCustomAmount("");
    setCalculatedPrice(null);
    onReset();
  };

  // Определяем минимальное количество (берем самое маленькое из пакетов)
  const minAmount =
    packages.length > 0 ? Math.min(...packages.map((p) => p.amount)) : 1;

  return (
    <div className="px-4 py-4 md:px-0">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-lg">
            {currencyImage && (
              <CurrencyIcon
                src={currencyImage}
                alt={currencyName}
                width={24}
                height={24}
                className="w-5 h-5 md:w-6 md:h-6 object-contain"
              />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {translations.title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translations.placeholder}
            </label>
            <div className="relative">
              <input
                type="text"
                value={customAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder={`${translations.minAmount}: ${minAmount}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <div className="absolute right-3 top-2 text-gray-400 text-sm">
                {currencyName}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            {pricePerUnit && (
              <div className="text-sm text-gray-600 mb-2">
                {translations.pricePerUnit}: {pricePerUnit.toFixed(4)} ₽
              </div>
            )}
            {calculatedPrice && (
              <div className="text-lg font-semibold text-green-600 mb-2">
                {translations.totalPrice}: {calculatedPrice.toFixed(2)} ₽
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleCalculate}
            disabled={!customAmount || !calculatedPrice}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg font-medium transition-all",
              customAmount && calculatedPrice
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            {translations.calculate}
          </button>

          {isActive && (
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
            >
              {translations.reset}
            </button>
          )}
        </div>

        {isActive && customAmount && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="text-green-600">✓</div>
              <div className="text-sm text-green-800">
                {locale === "ru"
                  ? `Выбрано: ${parseInt(
                      customAmount
                    ).toLocaleString()} ${currencyName} за ${calculatedPrice?.toFixed(
                      2
                    )} ₽`
                  : `Selected: ${parseInt(
                      customAmount
                    ).toLocaleString()} ${currencyName} for ${calculatedPrice?.toFixed(
                      2
                    )} ₽`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
