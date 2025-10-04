"use client";

import { cn } from "@/shared/utils/cn";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { CurrencyIcon } from "@/shared/ui/currency-icon";

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

interface DiamondPackagesProps {
  packages: Package[];
  onSelect: (id: number) => void;
  selectedId: number | null;
  currencyName: string;
  currencyImage: string;
  productId?: number;
  onCustomAmountClick?: () => void;
  showCustomAmountButton?: boolean;
}

export function DiamondPackages({
  packages,
  onSelect,
  selectedId,
  currencyName,
  currencyImage,
  productId,
  onCustomAmountClick,
  showCustomAmountButton = true,
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
      customAmount: "Свое значение",
    },
    en: {
      selectPackage: "Select Package",
      showAll: "Show All",
      hide: "Hide",
      bonus: "bonus",
      discount: "DISCOUNT",
      popular: "Popular",
      customAmount: "Custom Amount",
    },
  };

  const t =
    translations[locale as keyof typeof translations] || translations.ru;

  // На мобильных показываем только первые 6 пакетов, если не нажали "Показать все"
  // На PC показываем все пакеты сразу
  const MOBILE_VISIBLE_COUNT = 6;
  const displayedPackages =
    isMobile && !showAll ? packages.slice(0, MOBILE_VISIBLE_COUNT) : packages;
  const hasMorePackages = isMobile && packages.length > MOBILE_VISIBLE_COUNT;

  // Функция для получения fallback emoji в зависимости от типа валюты
  const getFallbackEmoji = (currencyName: string) => {
    const name = currencyName.toLowerCase();
    if (name.includes("diamond")) return "💎";
    if (name === "uc" || name.includes("uc") || name.includes("coins"))
      return "🪙";
    if (name.includes("gold")) return "🏆";
    if (name.includes("gem")) return "💎";
    if (name.includes("crystal")) return "💎";
    if (name.includes("service") || name.includes("услуга")) return "⚙️";
    return "🪙"; // Default fallback
  };

  // Функция для отображения количества в зависимости от типа услуги
  const getAmountDisplay = (pkg: Package) => {
    if (currencyName === "Услуга" || currencyName === "Service") {
      return locale === "ru"
        ? `${pkg.amount} ${pkg.amount === 1 ? "иконка" : "иконок"}`
        : `${pkg.amount} ${pkg.amount === 1 ? "icon" : "icons"}`;
    }
    return pkg.amount.toLocaleString();
  };

  // Функция для форматирования цены без лишних нулей
  const formatPrice = (price: number): string => {
    return price % 1 === 0 ? `${price.toFixed(0)} ₽` : `${price.toFixed(2)} ₽`;
  };

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
    <div className="px-4 py-1 md:px-0">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-3 md:gap-3 lg:gap-4">
        {displayedPackages.map((pkg, index) => {
          const isSelected = selectedId === pkg.id;
          const hasDiscountPercent =
            pkg.discountPercent &&
            pkg.discountPercent > 0 &&
            pkg.discountPercent !== 0;
          const hasDiscount = pkg.discount && pkg.discount > 0;

          // Debug: логируем данные пакетов
          console.log(`Package ${index}:`, {
            id: pkg.id,
            amount: pkg.amount,
            price: pkg.price,
            originalPriceRub: pkg.originalPriceRub,
            discountPercent: pkg.discountPercent,
            hasDiscountPercent,
          });

          return (
            <div
              key={pkg.id}
              onClick={() => handlePackageSelect(pkg.id)}
              className={cn(
                "relative rounded-xl p-3 cursor-pointer transition-all duration-200 border-2 min-h-[80px] flex flex-col justify-center",
                hasDiscountPercent
                  ? "border-red-400 bg-gradient-to-br from-red-50 to-red-100 shadow-lg transform hover:scale-[1.02]"
                  : isSelected
                  ? "border-[#007bff] bg-[#f8f9fa]"
                  : "border-[#e9ecef] bg-white hover:border-[#dee2e6]",
                hasDiscountPercent &&
                  isSelected &&
                  "ring-2 ring-red-300 ring-opacity-50"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
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
                <div className="text-[14px] md:text-[16px] font-semibold text-[#212529] leading-tight">
                  {getAmountDisplay(pkg)}
                </div>
              </div>
              {/* Скидочная плашка и тип валюты */}
              <div className="flex items-center justify-between mb-1">
                <div className="text-[11px] md:text-[12px] text-[#6c757d]">
                  {productId === 9999
                    ? locale === "ru"
                      ? "генерация иконок"
                      : "icon generation"
                    : currencyName}
                </div>
                {hasDiscountPercent && pkg.discountPercent != 0 && (
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    -{pkg.discountPercent}%
                  </span>
                )}
              </div>

              {/* Цена - всегда показываем */}
              <div className="flex flex-col">
                {hasDiscountPercent &&
                  pkg.discountPercent != 0 &&
                  pkg.originalPriceRub > 0 && (
                    <div className="text-[10px] md:text-[11px] text-gray-400 line-through mb-0.5">
                      {formatPrice(pkg.originalPriceRub)}
                    </div>
                  )}
                <div
                  className={cn(
                    "text-[13px] md:text-[14px] font-medium",
                    hasDiscountPercent
                      ? "text-green-600 font-bold"
                      : "text-[#212529]"
                  )}
                >
                  {(() => {
                    // Сначала определяем финальную цену
                    let finalPrice = 0;

                    if (
                      hasDiscountPercent &&
                      pkg.discountPercent &&
                      pkg.discountPercent !== 0 &&
                      pkg.originalPriceRub > 0
                    ) {
                      finalPrice =
                        pkg.originalPriceRub * (1 - pkg.discountPercent / 100);
                    } else {
                      // Если цена уже содержит символ рубля, проверяем её формат
                      if (
                        typeof pkg.price === "string" &&
                        pkg.price.includes("₽")
                      ) {
                        finalPrice = parseFloat(
                          pkg.price.replace(/[^\d.,]/g, "").replace(",", ".")
                        );
                      } else {
                        finalPrice = parseFloat(pkg.price.toString());
                      }
                    }

                    // Если цена 0 или NaN, не показываем её
                    if (!finalPrice || finalPrice <= 0 || isNaN(finalPrice)) {
                      return "";
                    }

                    return formatPrice(finalPrice);
                  })()}
                </div>
              </div>
              {/* Популярный бейдж для пакетов со скидкой */}
              {hasDiscountPercent && pkg.discountPercent !== 0 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[8px] md:text-[9px] font-bold px-2 py-1 rounded-full shadow-md transform rotate-12">
                  {locale === "ru" ? "ХИТ" : "HIT"}
                </div>
              )}

              {isSelected && (
                <div className="absolute top-2 right-2 text-[#007bff] text-sm">
                  <svg
                    width="16"
                    height="16"
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

        {/* Custom Amount Button - добавляем как отдельную карточку в grid */}
        {showCustomAmountButton && onCustomAmountClick && (
          <div
            onClick={onCustomAmountClick}
            className={cn(
              "relative rounded-xl p-3 cursor-pointer transition-all duration-200 border-2 min-h-[80px] flex flex-col justify-center items-center",
              "border-dashed border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100",
              "hover:border-blue-500 transform hover:scale-[1.02]"
            )}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-2xl mb-1">💎</div>
              <div className="text-[13px] md:text-[14px] font-semibold text-blue-600 leading-tight mb-1">
                {t.customAmount}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Show all button - только для мобильных устройств если есть скрытые пакеты */}
      {hasMorePackages && (
        <div className="mt-5 mb-5 text-center md:hidden">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 font-medium text-sm px-6 py-3 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {showAll ? t.hide : t.showAll}
          </button>
        </div>
      )}
    </div>
  );
}
