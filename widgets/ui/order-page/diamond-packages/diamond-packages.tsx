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
    console.log("Package selected:", id);
    onSelect(id);

    // Автоматическая прокрутка к следующему шагу
    setTimeout(() => {
      console.log("=== Starting scroll search ===");

      const isDesktop = window.innerWidth >= 768;
      console.log("Is desktop:", isDesktop);

      let targetElement = null;
      let targetInput = null;

      if (isDesktop) {
        // Для десктопа ищем по специальному ID
        targetElement = document.getElementById("desktop-user-id-section");
        console.log("Desktop: found section by ID:", targetElement);

        if (targetElement) {
          targetInput = targetElement.querySelector(
            "input"
          ) as HTMLInputElement;
          console.log("Desktop: found input in section:", targetInput);
        }
      }

      // Если не нашли через десктопный ID, ищем обычным способом
      if (!targetElement) {
        targetElement = document.querySelector('[data-step="user-id"]');
        console.log("Fallback: found by data-step:", targetElement);

        if (targetElement) {
          targetInput = targetElement.querySelector(
            "input"
          ) as HTMLInputElement;
        }
      }

      // Если всё ещё не нашли input, ищем по placeholder напрямую
      if (!targetInput) {
        targetInput = document.querySelector(
          'input[placeholder*="USER ID"]'
        ) as HTMLInputElement;
        if (!targetInput) {
          targetInput = document.querySelector(
            'input[placeholder*="ID"]'
          ) as HTMLInputElement;
        }
        console.log("Direct search: found input:", targetInput);
      }

      console.log("Final target element:", targetElement);
      console.log("Final target input:", targetInput);

      if (targetElement && targetInput) {
        // Прокручиваем к секции
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: isDesktop ? "center" : "center",
          inline: "nearest",
        });

        console.log("Scrolled to section");

        // Фокусируемся на input через задержку
        setTimeout(() => {
          targetInput.focus();
          console.log("Focused on input");
        }, 600);
      } else if (targetInput) {
        // Если есть только input, прокручиваем к нему
        targetInput.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        setTimeout(() => {
          targetInput.focus();
          console.log("Focused on direct input");
        }, 600);
      } else {
        console.log("ERROR: No target found!");
        console.log(
          "Available elements with data-step:",
          document.querySelectorAll("[data-step]")
        );
        console.log("Available inputs:", document.querySelectorAll("input"));
        console.log(
          "Desktop section:",
          document.getElementById("desktop-user-id-section")
        );
      }
    }, 300);
  };

  return (
    <div className="px-4 py-6 md:px-0">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
        {displayedPackages.map((pkg) => {
          const isSelected = selectedId === pkg.id;
          const hasDiscount = pkg.discount && pkg.discount > 0;

          return (
            <div
              key={pkg.id}
              onClick={() => handlePackageSelect(pkg.id)}
              className={cn(
                "relative bg-white rounded-2xl p-3 cursor-pointer transition-all hover:shadow-lg border-2 border-transparent md:min-h-[140px] md:flex md:flex-col md:justify-between md:bg-gradient-to-br md:from-white md:to-gray-50 md:p-4",
                isSelected
                  ? "ring-2 ring-blue-500 shadow-xl border-blue-200 md:shadow-2xl md:scale-105 bg-gradient-to-br from-blue-50 to-white"
                  : "shadow-md hover:shadow-lg md:hover:scale-102"
              )}
            >
              {/* Package content */}
              <div className="flex flex-col gap-2 md:flex-col md:gap-3 md:text-center md:h-full md:justify-center">
                {/* Top row - Icon and amount */}
                <div className="flex items-center justify-between">
                  {/* Currency icon */}
                  <div className="w-10 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-sm md:w-12 md:h-10 md:mx-auto">
                    <Image
                      src="/diamond.webp"
                      alt="Diamond"
                      width={20}
                      height={20}
                      className="w-4 h-4 md:w-6 md:h-6 object-contain"
                    />
                  </div>

                  {/* Amount */}
                  <div className="text-gray-800 font-bold text-lg md:text-xl md:font-bold">
                    {pkg.amount.toLocaleString()}
                  </div>

                  {/* Mobile discount indicator */}
                  <div className="flex items-center md:hidden">
                    {hasDiscount && pkg.discount! > 0 && (
                      <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                    )}
                    {!hasDiscount && !pkg.isPopular && (
                      <span className="text-base">🎁</span>
                    )}
                  </div>
                </div>

                {/* Price section */}
                <div className="flex flex-col gap-1 md:justify-center md:flex-col md:gap-1 md:mb-0">
                  <div className="flex items-center justify-between md:justify-center">
                    <span className="text-red-600 font-bold text-base md:text-lg">
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
                          <div className="bg-red-50 px-1.5 py-0.5 rounded border border-red-100 md:px-2 md:py-1">
                            <span className="text-red-500 text-xs line-through font-medium">
                              {oldPrice} {pkg.price.split(" ")[1]}
                            </span>
                          </div>
                        ) : null;
                      })()}
                  </div>

                  {/* Bonus */}
                  {pkg.bonus && pkg.bonus > 0 && (
                    <div className="text-green-600 text-xs font-medium text-center md:text-center">
                      +{pkg.bonus} {t.bonus}
                    </div>
                  )}
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
              {/* Subtle glow effect for selected cards on desktop */}
              {isSelected && (
                <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show all button - для всех устройств если есть скрытые пакеты */}
      {hasMorePackages && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm underline transition-colors md:bg-blue-50 md:hover:bg-blue-100 md:px-4 md:py-2 md:rounded-lg md:no-underline md:border md:border-blue-200"
          >
            {showAll ? t.hide : t.showAll}
          </button>
        </div>
      )}
    </div>
  );
}
