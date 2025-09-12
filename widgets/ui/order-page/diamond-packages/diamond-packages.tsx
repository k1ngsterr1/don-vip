"use client";

import { cn } from "@/shared/utils/cn";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useState } from "react";

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
  const locale = useLocale();
  const [showAll, setShowAll] = useState(false);

  // Хардкодные переводы
  const translations = {
    ru: {
      selectPackage: "Выберите пакет",
      showAll: "Показать все",
      hide: "Скрыть",
      bonus: "бонус",
      discount: "СКИДКА",
      popular: "Популярный",
    },
    en: {
      selectPackage: "Select Package",
      showAll: "Show All",
      hide: "Hide",
      bonus: "bonus",
      discount: "DISCOUNT",
      popular: "Popular",
    },
  };

  const t =
    translations[locale as keyof typeof translations] || translations.ru;

  // На мобильных показываем только первые 4 пакета, если не нажали "Показать все"
  const MOBILE_VISIBLE_COUNT = 4;
  const displayedPackages = showAll
    ? packages
    : packages.slice(0, MOBILE_VISIBLE_COUNT);
  const hasMorePackages = packages.length > MOBILE_VISIBLE_COUNT;

  const handlePackageSelect = (id: number) => {
    onSelect(id);

    // Автоматическая прокрутка к следующему шагу через небольшую задержку
    setTimeout(() => {
      // Сначала ищем поле ввода User ID
      const userIdSection = document.querySelector('[data-step="user-id"]');

      if (userIdSection) {
        userIdSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Ищем input поле в секции и фокусируемся на нем
        const inputField = userIdSection.querySelector("input");
        if (inputField) {
          setTimeout(() => {
            inputField.focus();
          }, 500);
        }

        // Через 2.5 секунды прокручиваем к методам оплаты
        setTimeout(() => {
          const paymentSection = document.querySelector(
            '[data-step="payment"]'
          );

          if (paymentSection) {
            paymentSection.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 2500);
      }
    }, 500);
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-medium text-gray-800 mb-6">
        {t.selectPackage}
      </h2>

      <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 md:space-y-0">
        {displayedPackages.map((pkg) => {
          const isSelected = selectedId === pkg.id;
          const hasDiscount = pkg.discount && pkg.discount > 0;

          return (
            <div
              key={pkg.id}
              onClick={() => handlePackageSelect(pkg.id)}
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
                  <Image
                    src="/diamond.webp"
                    alt="Diamond"
                    width={24}
                    height={24}
                    className="w-5 h-5 md:w-6 md:h-6 object-contain"
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
                    {hasDiscount &&
                      pkg.discount &&
                      pkg.discount > 0 &&
                      (() => {
                        const oldPrice = (
                          parseFloat(pkg.price.split(" ")[0]) /
                          (1 - pkg.discount! / 100)
                        ).toFixed(2);
                        return oldPrice !== "0.00" &&
                          parseFloat(oldPrice) > 0 ? (
                          <div className="bg-red-50 px-2 py-1 rounded-md border border-red-100">
                            <span className="text-red-500 text-xs line-through font-medium">
                              {oldPrice} {pkg.price.split(" ")[1]}
                            </span>
                          </div>
                        ) : null;
                      })()}
                    {/* Hide bonus if it's 0 */}
                    {pkg.bonus && pkg.bonus > 0 && (
                      <div className="text-green-600 text-xs font-medium">
                        +{pkg.bonus} {t.bonus}
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
                      {t.discount} {pkg.discount}%
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
                  {t.popular}
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

      {/* Show all button - только для мобильных устройств и если есть скрытые пакеты */}
      {hasMorePackages && (
        <div className="mt-6 text-center md:hidden">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm underline transition-colors"
          >
            {showAll ? t.hide : t.showAll}
          </button>
        </div>
      )}
    </div>
  );
}
