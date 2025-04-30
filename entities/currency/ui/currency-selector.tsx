"use client";

import type { CurrencyOption } from "@/entities/currency/model/types";
import { cn } from "@/shared/utils/cn";
import { Check } from "lucide-react";
import Image from "next/image";

interface CurrencySelectorProps {
  options: CurrencyOption[];
  currencyName: string;
  currencyImage: string;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function CurrencySelector({
  options,
  currencyName,
  currencyImage,
  selectedId,
  onSelect,
}: CurrencySelectorProps) {
  return (
    <div className="px-4 mb-6">
      <h2 className="text-dark font-roboto text-[16px] font-medium mb-4">
        1 ВЫБЕРИТЕ СУММУ ПОПОЛНЕНИЯ
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {options.map((item) => (
          <button
            key={item.id}
            className={cn(
              "bg-[#EEEFF3] h-[104px] w-full shadow-md p-3 rounded-lg flex flex-col items-start relative overflow-hidden"
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
                {item.amount} {currencyName}
              </span>
              <Image
                src={currencyImage || "/placeholder.svg"}
                width={42}
                height={31}
                alt={currencyName}
                className="object-contain absolute right-2 bottom-2"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
