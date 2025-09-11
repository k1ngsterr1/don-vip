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
      <h2 className="text-lg font-medium text-gray-800 mb-4">
        Выберите пакет {currencyName}
      </h2>

      <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-3 md:space-y-0">
        {packages.map((pkg) => {
          const isSelected = selectedId === pkg.id;
          const hasDiscount = pkg.discount && pkg.discount > 0;

          return (
            <div
              key={pkg.id}
              onClick={() => onSelect(pkg.id)}
              className={cn(
                "relative bg-[#eeeff3] rounded-xl p-4 cursor-pointer transition-all",
                isSelected && "ring-2 ring-blue-500"
              )}
            >
              {/* Package content */}
              <div className="flex items-center gap-3">
                {/* Currency icon */}
                <div className="w-12 h-9 bg-[#eeeff3] rounded flex items-center justify-center">
                  <div
                    className="w-5 h-5 bg-cover bg-center"
                    style={{ backgroundImage: `url('${currencyImage}')` }}
                  />
                </div>

                {/* Package info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-600 font-medium text-sm">
                      {pkg.price}
                    </span>
                    {hasDiscount && (
                      <div className="bg-red-50 px-2 py-1 rounded">
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

                  <div className="text-gray-800 font-medium">
                    {pkg.amount.toLocaleString()} {currencyName}
                  </div>
                </div>

                {/* Discount badge or gift icon */}
                <div className="flex items-center gap-2">
                  {hasDiscount && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium transform rotate-12">
                      ОК
                    </div>
                  )}
                  <span className="text-lg">🎁</span>
                </div>
              </div>

              {/* Popular badge */}
              {pkg.isPopular && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium transform rotate-12">
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
