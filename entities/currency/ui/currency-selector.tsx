"use client";

import type { CurrencyOption } from "@/entities/currency/model/types";
import { cn } from "@/shared/utils/cn";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/entities/currency/hooks/use-currency";
import { useState } from "react";

interface CurrencySelectorProps {
  options: CurrencyOption[];
  currencyName: string;
  currencyImage: string;
  selectedId: number | null;
  onSelect: (id: number) => void;
  enhanced?: boolean;
  enableUserUpdate?: boolean;
  currencyCode?: string;
}

export function CurrencySelector({
  options,
  currencyName,
  currencyImage,
  selectedId,
  onSelect,
  enhanced = false,
  enableUserUpdate = false,
  currencyCode = "USD",
}: CurrencySelectorProps) {
  const i18n = useTranslations("CurrencySelector");
  const locale = useLocale();
  const { updateCurrency, availableCurrencies, isLoading, error } =
    useCurrency();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const isUpdating = updatingId !== null;

  const handleSelect = async (id: number) => {
    // Обычная логика выбора
    onSelect(id);

    // Если включено обновление пользователя, отправляем API запрос
    if (enableUserUpdate) {
      setUpdatingId(id);
      try {
        // Найдем валюту по коду
        const selectedCurrency = availableCurrencies.find(
          (c) => c.code === currencyCode
        );
        if (selectedCurrency) {
          await updateCurrency(selectedCurrency);
          console.log("Currency updated successfully");
        }
      } catch (err) {
        console.error("Failed to update user currency:", err);
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const getDisplayName = (item: CurrencyOption & { type?: string }) => {
    if (item.type === "Пропуск") {
      return locale === "ru" ? "Алмазный пропуск" : "Diamond Pass";
    }
    return i18n("amountWithCurrency", { amount: item.amount });
  };

  const mobileSelector = (
    <div className={enhanced ? "hidden" : "px-4 mb-6"}>
      <h2 className="text-dark font-medium mb-4">{i18n("title")}</h2>
      <div className="grid grid-cols-2 gap-3">
        {options.map((item) => (
          <button
            key={item.id}
            className={cn(
              "bg-[#EEEFF3] shadow-md p-3 rounded-lg flex flex-col items-start relative overflow-hidden",
              selectedId === item.id && "ring-1 ring-gray-300",
              updatingId === item.id && "opacity-70"
            )}
            onClick={() => handleSelect(item.id)}
            disabled={isUpdating}
          >
            {selectedId === item.id && updatingId !== item.id && (
              <div className="absolute top-0 right-0 w-[50px] h-[50px] overflow-hidden">
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-t-green-500 border-l-[50px] border-l-transparent"></div>
                <Check
                  className="absolute top-2 right-2 text-white"
                  size={16}
                />
              </div>
            )}
            {updatingId === item.id && (
              <div className="absolute top-2 right-2">
                <Loader2 className="text-blue animate-spin" size={16} />
              </div>
            )}
            <span className="text-dark font-bold text-lg">{item.price}</span>
            <span className="text-sm text-gray-600">
              {getDisplayName(item)}
            </span>
            <div className="flex items-center justify-between w-full mt-1">
              {currencyImage ? (
                <Image
                  src={currencyImage || "/placeholder.svg"}
                  width={30}
                  height={30}
                  alt={i18n("currencyIconAlt", { currencyName })}
                  className="object-contain"
                />
              ) : (
                <Image
                  src="/diamond.webp"
                  width={30}
                  height={30}
                  alt={i18n("currencyIconAlt", { currencyName })}
                  className="object-contain"
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const desktopSelector = (
    <div className={enhanced ? "" : "hidden"}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((item) => (
          <button
            key={item.id}
            className={cn(
              "bg-white border border-gray-200 p-4 rounded-lg flex flex-col items-start relative overflow-hidden transition-all",
              selectedId === item.id
                ? "ring-2 ring-blue shadow-md"
                : "hover:border-blue/30 hover:shadow-sm",
              updatingId === item.id && "opacity-70"
            )}
            onClick={() => handleSelect(item.id)}
            disabled={isUpdating}
          >
            {selectedId === item.id && updatingId !== item.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue rounded-full flex items-center justify-center">
                <Check className="text-white" size={14} />
              </div>
            )}
            {updatingId === item.id && (
              <div className="absolute top-3 right-3">
                <Loader2 className="text-blue animate-spin" size={16} />
              </div>
            )}
            <div className="flex items-center mb-2">
              {currencyImage ? (
                <>
                  <Image
                    src={currencyImage || "/placeholder.svg"}
                    width={36}
                    height={36}
                    alt={i18n("currencyIconAlt", { currencyName })}
                    className="object-contain mr-2"
                  />
                  <span className="text-sm text-gray-600">
                    {getDisplayName(item)}
                  </span>
                </>
              ) : (
                <Image
                  src="/diamond.webp"
                  width={36}
                  height={36}
                  alt={i18n("currencyIconAlt", { currencyName })}
                  className="object-contain mr-2"
                />
              )}
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {item.price}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {error && enableUserUpdate && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {locale === "ru"
            ? `Ошибка обновления валюты: ${error}`
            : `Currency update error: ${error}`}
        </div>
      )}
      {mobileSelector}
      {desktopSelector}
    </>
  );
}
