"use client";

import { cn } from "@/shared/utils/cn";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";

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
  const [isMobile, setIsMobile] = useState(false);

  // Отслеживаем размер экрана
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Проверяем при монтировании
    checkScreenSize();

    // Добавляем слушатель изменения размера
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
  // На PC показываем все пакеты сразу
  const MOBILE_VISIBLE_COUNT = 4;
  const displayedPackages =
    isMobile && !showAll ? packages.slice(0, MOBILE_VISIBLE_COUNT) : packages;
  const hasMorePackages = isMobile && packages.length > MOBILE_VISIBLE_COUNT;

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
      <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
        {displayedPackages.map((pkg) => {
          const isSelected = selectedId === pkg.id;
          const hasDiscount = pkg.discount && pkg.discount > 0;

          return (
            <div
              key={pkg.id}
              onClick={() => handlePackageSelect(pkg.id)}
              className={cn(
                "h-[68px] rounded-xl px-4 cursor-pointer transition-all duration-200 border flex items-center justify-between",
                isSelected
                  ? "border-[#03cc60] bg-[#eeeff3]"
                  : "border-transparent bg-[#eeeff3] hover:border-gray-300"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">💎</div>
                <div>
                  <div className="text-[18px] font-medium text-[#212529] leading-tight">
                    {pkg.amount.toLocaleString()} Diamonds
                  </div>
                  <div className="text-[14px] text-[#6c757d] leading-tight">
                    {pkg.price}
                  </div>
                </div>
              </div>
              {isSelected && (
                <div className="text-[#03cc60] text-xl">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show all button - только для мобильных устройств если есть скрытые пакеты */}
      {hasMorePackages && (
        <div className="mt-6 text-center md:hidden">
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
