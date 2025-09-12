"use client";

import { cn } from "@/shared/utils/cn";
import Image from "next/image";
import { useTranslations } from "next-intl";

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
}

interface DiamondPackagesProps {
  packages: Package[];
  onSelect: (id: number) => void;
  selectedId: number | null;
  currencyName: string;
  currencyImage: string;
}

export function DiamondPackages({
  packages,
  onSelect,
  selectedId,
  currencyName,
  currencyImage,
}: DiamondPackagesProps) {
  const t = useTranslations("orderBlock");

  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-medium text-gray-800 mb-6">Выберите пакет</h2>

      <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 md:space-y-0">
        {packages.map((pkg) => {
          const isSelected = selectedId === pkg.id;
          const hasDiscount = pkg.discount && pkg.discount > 0;

          return (
            <div
              key={pkg.id}
              onClick={() => onSelect(pkg.id)}
              className={cn(
                "relative bg-white rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg border-2 border-transparent md:min-h-[140px] md:flex md:flex-col md:justify-between md:bg-gradient-to-br md:from-white md:to-gray-50",
                isSelected
                  ? "ring-2 ring-blue-500 shadow-xl border-blue-200 md:shadow-2xl md:scale-105"
                  : "shadow-sm hover:shadow-md md:hover:scale-102"
              )}
            >
              {/* Package content */}
              <div className="flex items-center gap-3 md:flex-col md:gap-3 md:text-center md:h-full md:justify-center">
                {/* Currency icon */}
                <div className="w-12 h-9 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center shadow-sm md:w-12 md:h-10 md:mx-auto">
                  <div
                    className="w-5 h-5 bg-cover bg-center md:w-6 md:h-6"
                    style={{ backgroundImage: `url('${currencyImage}')` }}
                  />
                </div>

                {/* Package info */}
                <div className="flex-1 md:flex-none md:space-y-2">
                  <div className="text-gray-800 font-semibold text-base md:text-xl md:font-bold">
                    {pkg.amount.toLocaleString()}
                  </div>

                  <div className="flex items-center gap-2 mb-1 md:justify-center md:flex-col md:gap-1 md:mb-0">
                    <span className="text-red-600 font-bold text-sm md:text-lg">
                      {pkg.price}
                    </span>

                    {/* Hide bonus if it's 0 */}
                    {pkg.bonus && pkg.bonus > 0 && (
                      <div className="text-green-600 text-xs font-medium">
                        +{pkg.bonus} бонус
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile badges */}
                <div className="flex items-center gap-2 md:hidden">
                  {hasDiscount && pkg.discount! > 0 && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium transform rotate-12">
                      ОК
                    </div>
                  )}
                  {!hasDiscount && <span className="text-lg">🎁</span>}
                </div>
              </div>

              {/* Desktop badges - only show if there's actually something to show */}
              {(hasDiscount || pkg.isPopular) && (
                <div className="hidden md:flex md:items-center md:justify-center md:gap-2 md:mt-3">
                  {hasDiscount && pkg.discount! > 0 && (
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md">
                      СКИДКА {pkg.discount}%
                    </div>
                  )}
                </div>
              )}

              {/* Show gift icon only if no discount and not popular */}
              {!hasDiscount && !pkg.isPopular && (
                <div className="hidden md:flex md:items-center md:justify-center md:mt-3">
                  <span className="text-gray-400 text-lg">🎁</span>
                </div>
              )}

              {/* Popular badge */}
              {pkg.isPopular && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform rotate-12 md:rotate-3 md:-top-2 md:-right-2 md:px-4 md:py-1.5">
                  Популярный
                </div>
              )}

              {/* Subtle glow effect for selected cards on desktop */}
              {isSelected && (
                <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show all button */}
      <div className="mt-6 text-center">
        <button className="text-gray-800 font-medium text-sm">
          Показать Все
        </button>
      </div>
    </div>
  );
}
