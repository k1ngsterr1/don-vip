"use client";

import type { CurrencyOption } from "@/entities/currency/model/types";
import { cn } from "@/shared/utils/cn";
import { Check } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface CurrencySelectorProps {
  options: CurrencyOption[];
  currencyName: string;
  currencyImage: string;
  selectedId: number | null;
  onSelect: (id: number) => void;
  enhanced?: boolean;
}

export function CurrencySelector({
  options,
  currencyName,
  currencyImage,
  selectedId,
  onSelect,
  enhanced = false,
}: CurrencySelectorProps) {
  const i18n = useTranslations("CurrencySelector");

  // Mobile version
  const mobileSelector = (
    <div className={enhanced ? "hidden" : "px-4 mb-6"}>
      <h2 className="text-dark font-medium mb-4">{i18n("title")}</h2>
      <div className="grid grid-cols-2 gap-3">
        {options.map((item) => (
          <button
            key={item.id}
            className={cn(
              "bg-[#EEEFF3] shadow-md p-3 rounded-lg flex flex-col items-start relative overflow-hidden",
              selectedId === item.id && "ring-1 ring-gray-300"
            )}
            onClick={() => onSelect(item.id)}
          >
            {selectedId === item.id && (
              <div className="absolute top-0 right-0 w-[50px] h-[50px] overflow-hidden">
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-t-green-500 border-l-[50px] border-l-transparent"></div>
                <Check
                  className="absolute top-2 right-2 text-white"
                  size={16}
                />
              </div>
            )}

            <span className="text-dark font-bold text-lg">{item.price}</span>
            <div className="flex items-center justify-between w-full mt-1">
              <span className="text-sm text-gray-600">
                {i18n("amountWithCurrency", {
                  amount: item.amount,
                  currencyName,
                })}
              </span>
              <Image
                src={currencyImage || "/placeholder.svg"}
                width={30}
                height={30}
                alt={i18n("currencyIconAlt", { currencyName })}
                className="object-contain"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Desktop version
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
                : "hover:border-blue/30 hover:shadow-sm"
            )}
            onClick={() => onSelect(item.id)}
          >
            {selectedId === item.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue rounded-full flex items-center justify-center">
                <Check className="text-white" size={14} />
              </div>
            )}

            <div className="flex items-center mb-2">
              <Image
                src={currencyImage || "/placeholder.svg"}
                width={36}
                height={36}
                alt={i18n("currencyIconAlt", { currencyName })}
                className="object-contain mr-2"
              />
              <span className="text-gray-700 font-medium">
                {i18n("amountWithCurrency", {
                  amount: item.amount,
                  currencyName,
                })}
              </span>
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
      {mobileSelector}
      {desktopSelector}
    </>
  );
}
