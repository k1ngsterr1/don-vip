"use client";

import { cn } from "@/shared/utils/cn";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { CurrencyIcon } from "@/shared/ui/currency-icon";
import { useCurrency } from "@/entities/currency/hooks/use-currency";
import { useDiamondPrice } from "@/entities/diamond-price/hooks/use-diamond-price";

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
  const { selectedCurrency } = useCurrency();

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

  // Проверяем, является ли валюта алмазами
  const isDiamondCurrency =
    currencyName?.toLowerCase().includes("diamond") ||
    currencyName?.toLowerCase().includes("алмаз") ||
    currencyName?.toLowerCase().includes("diamonds") ||
    currencyName?.toLowerCase().includes("алмазы");

  // Логирование для отладки
  console.log("CustomAmountSelector Debug:", {
    currencyName,
    isDiamondCurrency,
    selectedCurrency: selectedCurrency?.code,
  });

  // Получаем цену алмаза с бэкенда только если это алмазная валюта
  const { data: diamondPriceData, isLoading: isDiamondPriceLoading } =
    useDiamondPrice(selectedCurrency?.code || "RUB");

  // Логирование данных с бэкенда
  console.log("Diamond Price Data:", {
    diamondPriceData,
    isDiamondPriceLoading,
    isDiamondCurrency,
  });

  // Вычисляем цену за единицу
  useEffect(() => {
    if (!selectedCurrency) return;

    if (isDiamondCurrency) {
      // Для алмазов используем цену с бэкенда
      if (diamondPriceData && !isDiamondPriceLoading) {
        const backendPricePerDiamond = diamondPriceData.price_per_diamond;

        // Конвертируем цену в выбранную валюту
        const priceInSelectedCurrency =
          selectedCurrency.code === "RUB"
            ? backendPricePerDiamond
            : backendPricePerDiamond * selectedCurrency.rate;

        setPricePerUnit(priceInSelectedCurrency);
      } else if (isDiamondPriceLoading) {
        // Пока загружается цена с бэкенда, очищаем pricePerUnit
        setPricePerUnit(null);
      }
    } else if (packages.length > 0) {
      // Для других валют используем расчет на основе пакетов
      const middlePackages = packages
        .slice()
        .sort((a, b) => a.amount - b.amount)
        .slice(1, -1); // Исключаем самый маленький и самый большой

      if (middlePackages.length > 0) {
        const averagePrice =
          middlePackages.reduce((sum, pkg) => {
            // Используем цену в выбранной валюте из pkg.price
            const priceInSelectedCurrency = parseFloat(
              pkg.price.replace(/[^\d.,]/g, "").replace(",", ".")
            );
            return sum + priceInSelectedCurrency / pkg.amount;
          }, 0) / middlePackages.length;

        setPricePerUnit(averagePrice);
      }
    }
  }, [
    packages,
    selectedCurrency,
    isDiamondCurrency,
    diamondPriceData,
    isDiamondPriceLoading,
  ]);

  // Функция для получения fallback emoji в зависимости от типа валюты
  const getFallbackEmoji = (currencyName: string) => {
    const name = currencyName?.toLowerCase() || "";
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
    if (customAmount && calculatedPrice && pricePerUnit && selectedCurrency) {
      const amount = parseInt(customAmount);
      if (amount > 0) {
        let priceInRub: number;

        if (isDiamondCurrency && diamondPriceData) {
          // Для алмазов используем точную цену с бэкенда в рублях
          priceInRub = amount * diamondPriceData.price_per_diamond;
        } else {
          // Для других валют конвертируем цену обратно в рубли
          priceInRub =
            selectedCurrency.code === "RUB"
              ? calculatedPrice
              : calculatedPrice / selectedCurrency.rate;
        }

        onCustomAmountSelect(amount, priceInRub);
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
            </div>
          </div>

          <div className="flex flex-col justify-end">
            {isDiamondPriceLoading && isDiamondCurrency && (
              <div className="text-sm text-gray-500 mb-2">
                Загружается цена с сервера...
              </div>
            )}
            {pricePerUnit && selectedCurrency && (
              <div className="text-sm text-gray-600 mb-2">
                {translations.pricePerUnit}: {pricePerUnit.toFixed(1)}{" "}
                {selectedCurrency.symbol}
              </div>
            )}
            {calculatedPrice && selectedCurrency && (
              <div className="text-lg font-semibold text-green-600 mb-2">
                {translations.totalPrice}: {calculatedPrice.toFixed(2)}{" "}
                {selectedCurrency.symbol}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleCalculate}
            disabled={
              !customAmount ||
              !calculatedPrice ||
              (isDiamondCurrency && isDiamondPriceLoading)
            }
            className={cn(
              "flex-1 py-2 px-4 rounded-lg font-medium transition-all",
              customAmount &&
                calculatedPrice &&
                !(isDiamondCurrency && isDiamondPriceLoading)
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            {isDiamondCurrency && isDiamondPriceLoading
              ? "Загрузка..."
              : translations.calculate}
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
