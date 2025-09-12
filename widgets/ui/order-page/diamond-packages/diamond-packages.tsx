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
      <h2 className="text-lg font-medium text-gray-800 mb-6">
        Выберите пакет {currencyName}
      </h2>

      <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 md:space-y-0">
        {packages.map((pkg) => {
          const isSelected = selectedId === pkg.id;
          const hasDiscount = pkg.discount && pkg.discount > 0;

          return (
            <div
              key={pkg.id}
              onClick={() => onSelect(pkg.id)}
              className={cn(
                "relative bg-[#eeeff3] rounded-xl p-4 cursor-pointer transition-all hover:shadow-md md:h-auto md:min-h-[120px] md:flex md:flex-col md:justify-between",
                isSelected && "ring-2 ring-blue-500 shadow-lg"
              )}
            >
              {/* Package content */}
              <div className="flex items-center gap-3 md:flex-col md:gap-2 md:text-center md:h-full">
                {/* Currency icon */}
                <div className="w-12 h-9 bg-white rounded flex items-center justify-center shadow-sm md:w-10 md:h-8 md:mx-auto">
                  <div
                    className="w-5 h-5 bg-cover bg-center md:w-4 md:h-4"
                    style={{ backgroundImage: `url('${currencyImage}')` }}
                  />
                </div>

                {/* Package info */}
                <div className="flex-1 md:flex-none md:space-y-1">
                  <div className="text-gray-800 font-medium text-base md:text-lg">
                    {pkg.amount.toLocaleString()} {currencyName}
                  </div>

                  <div className="flex items-center gap-2 mb-1 md:justify-center md:flex-col md:gap-1 md:mb-0">
                    <span className="text-red-600 font-semibold text-sm md:text-base">
                      {pkg.price}
                    </span>
                    {hasDiscount && (
                      <div className="bg-red-50 px-2 py-1 rounded md:px-1 md:py-0.5">
                        <span className="text-red-600 text-xs line-through">
                          {(
                            parseFloat(pkg.price.split(" ")[0]) /
                            (1 - pkg.discount! / 100)
                          ).toFixed(2)}{" "}
                          руб
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Discount badge or gift icon - Mobile only */}
                <div className="flex items-center gap-2 md:hidden">
                  {hasDiscount && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium transform rotate-12">
                      ОК
                    </div>
                  )}
                  <span className="text-lg">🎁</span>
                </div>
              </div>

              {/* Desktop badges */}
              <div className="hidden md:flex md:items-center md:justify-center md:gap-2 md:mt-2">
                {hasDiscount && (
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                    ОК
                  </div>
                )}
                <span className="text-lg">🎁</span>
              </div>

              {/* Popular badge */}
              {pkg.isPopular && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium transform rotate-12 md:rotate-0 md:-top-1 md:-right-1 md:px-2">
                  Популярный
                </div>
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
