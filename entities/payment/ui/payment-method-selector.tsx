"use client";

import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import tbankIcon from "@/assets/T-Bank.webp";
import mastercardIcon from "@/assets/mastercard.webp";
import visaIcon from "@/assets/visa.webp";
import sbpIcon from "@/assets/sbp.svg";
import paypalIcon from "@/assets/paypal.webp";
import { useGetActiveBanks } from "@/entities/bank/hooks/use-get-active-banks";
import {
  usePaymentMethods,
  useUserPaymentMethods,
  usePaymentMethodsByCurrency,
} from "@/entities/payment/hooks/use-payment-methods";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Helper function to get full icon URL
 */
export const getIconUrl = (iconPath: string | null): string | null => {
  console.log("getIconUrl input:", iconPath);

  if (!iconPath) {
    console.log("getIconUrl output: null (empty input)");
    return null;
  }

  let result: string;

  // If iconPath already contains a full URL, return as is
  if (iconPath.startsWith("http://") || iconPath.startsWith("https://")) {
    result = iconPath;
    console.log("getIconUrl output (full URL):", result);
    return result;
  }

  // If path starts with /uploads, add base URL directly
  if (iconPath.startsWith("/uploads/")) {
    result = `https://api.don-vip.com${iconPath}`;
    console.log("getIconUrl output (/uploads path):", result);
    return result;
  }

  // For any other relative path, add base URL
  result = `https://api.don-vip.com/uploads/${iconPath.replace(/^\//, "")}`;
  console.log("getIconUrl output (relative path):", result);
  return result;
};

/**
 * Helper function to get icon src for Image component
 */
const getIconSrc = (icon: StaticImageData | string): string => {
  console.log("getIconSrc input:", icon);
  let result: string;

  if (typeof icon === "string") {
    result = icon;
  } else {
    result = icon.src || "/placeholder.svg";
  }

  console.log("getIconSrc output:", result);
  return result;
};

interface PaymentMethodSelectorProps {
  enhanced?: boolean;
  selectedMethod?: string;
  onSelect?: (
    method: string,
    isMoneta?: boolean,
    code?: string,
    isDukPay?: boolean,
    isPay4Game?: boolean
  ) => void;
  currentCurrency?: string; // Add currency prop
  region?: string; // Add region prop
  amount?: number; // Add amount prop for filtering
  useUserMethods?: boolean; // New prop to enable user-specific methods
  useCurrencyMethods?: boolean; // New prop to enable currency-specific methods
}

interface FrontendPaymentMethod {
  id: string;
  translationKey: string; // To get the display name via i18n
  apiName: string; // Name used in the API for matching
  icon: StaticImageData | string; // Allow both StaticImageData and string URLs
  descriptionKey?: string;
  description?: string | null; // Добавляем description из API
  isMoneta?: boolean; // Flag for Moneta payment methods
  isDukPay?: boolean; // Flag for DukPay payment methods
  isPay4Game?: boolean; // Flag for Pay4Game payment methods
  isPagsmile?: boolean; // Flag for Pagsmile payment methods
  code?: string; // Payment method code for Moneta/DukPay/Pay4Game
}

export function PaymentMethodSelector({
  enhanced = false,
  selectedMethod = "", // Change default to empty string
  onSelect = () => {},
  currentCurrency = "RUB", // Default to RUB (fallback if localStorage is empty)
  region = "RU", // Default to Russia
  amount, // Amount for filtering
  useUserMethods = false, // Default to false for backward compatibility
  useCurrencyMethods = false, // Default to false for backward compatibility
}: PaymentMethodSelectorProps) {
  const i18n = useTranslations("PaymentMethodSelector");

  // State for actual currency being used (from localStorage or prop)
  const [activeCurrency, setActiveCurrency] = useState<string>(currentCurrency);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load currency from localStorage
  useEffect(() => {
    if (!isClient) return;

    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      try {
        const parsed = JSON.parse(savedCurrency);
        if (parsed.code) {
          setActiveCurrency(parsed.code);
        }
      } catch (e) {
        console.error("Error parsing saved currency:", e);
        setActiveCurrency(currentCurrency);
      }
    } else {
      setActiveCurrency(currentCurrency);
    }
  }, [isClient, currentCurrency]);

  // Function to get appropriate icon for payment method
  const getPaymentMethodIcon = (
    methodType: string,
    methodName: string
  ): StaticImageData => {
    // Добавляем проверки на undefined/null
    const safeMethodType = methodType || "";
    const safeMethodName = methodName || "";

    const lowerType = safeMethodType.toLowerCase();
    const lowerName = safeMethodName.toLowerCase();

    if (lowerName.includes("visa")) return visaIcon;
    if (lowerName.includes("mastercard")) return mastercardIcon;
    if (lowerName.includes("paypal")) return paypalIcon;
    if (lowerType === "card" || lowerType === "credit_card")
      return mastercardIcon;
    if (lowerType === "wallet") return paypalIcon;
    if (lowerName.includes("tbank") || lowerName.includes("t-bank"))
      return tbankIcon;
    if (lowerName.includes("sbp") || lowerType === "sbp") return sbpIcon;

    // Default to mastercard for unknown types
    return mastercardIcon;
  };

  // Function to get icon src as string for API methods
  const getPaymentMethodIconSrc = (
    methodType: string,
    methodName: string
  ): string => {
    const icon = getPaymentMethodIcon(methodType, methodName);
    return getIconSrc(icon);
  };

  const {
    data: activeBanksResponse,
    isLoading: banksLoading,
    error: banksError,
  } = useGetActiveBanks();

  // Get payment methods from API
  const {
    paymentMethods: apiPaymentMethods,
    isLoading: methodsLoading,
    error: methodsError,
    refetch,
  } = usePaymentMethods({
    currency: activeCurrency,
    region: region,
    amount: amount,
  });

  // Get user-specific payment methods (requires authentication)
  const {
    userMethods,
    isLoading: userMethodsLoading,
    error: userMethodsError,
    refetch: refetchUserMethods,
  } = useUserPaymentMethods();

  // Get currency-specific payment methods for all currencies (including RUB for Moneta methods)
  const {
    methodsByCurrency,
    isLoading: currencyMethodsLoading,
    error: currencyMethodsError,
    refetch: refetchCurrencyMethods,
  } = usePaymentMethodsByCurrency(isClient ? activeCurrency : undefined);

  // Define frontend payment methods with a mapping to API names
  const allPaymentMethods: FrontendPaymentMethod[] = [
    {
      id: "sbp_pagsmile", // Changed to distinguish from Pay4Game SBP
      translationKey: "methods.sbp",
      apiName: "SBP",
      icon: sbpIcon,
      isPagsmile: true, // Mark as Pagsmile method
    },
    {
      id: "tbank",
      translationKey: "methods.tbank",
      apiName: "T-Bank", // Example: This should match the 'name' field from your Bank API for T-Bank
      icon: tbankIcon,
      descriptionKey: "tbankDescription",
    },
    // {
    //   id: "card",
    //   translationKey: "methods.card",
    //   apiName: "Card",
    //   icon: mastercardIcon,
    // },
    // Add other payment methods here if needed
  ];

  const activeApiBankNames =
    activeBanksResponse?.data.map((bank) => bank.name) || [];

  // Determine available payment methods with currency-specific logic
  let availablePaymentMethods: FrontendPaymentMethod[] = [];

  // For RUB currency: Combine local methods (SBP, T-Bank) with API methods (Moneta) - WITH DEDUPLICATION
  if (activeCurrency === "RUB") {
    // First add filtered local methods (SBP, T-Bank)
    const filteredLocalMethods = allPaymentMethods.filter((method) =>
      activeApiBankNames.includes(method.apiName)
    );

    console.log(
      "🏦 Filtered local methods:",
      filteredLocalMethods.map((m) => ({ id: m.id, apiName: m.apiName }))
    );

    availablePaymentMethods = [...filteredLocalMethods];

    // Then add API methods (including Moneta methods) if available - SKIP DUPLICATES
    if (methodsByCurrency && methodsByCurrency.methods.length > 0) {
      console.log(
        "🌐 Raw API methods received:",
        methodsByCurrency.methods.map((m) => ({
          name: m.name,
          methodCode: m.methodCode,
          isMoneta: m.isMoneta,
          isDukPay: m.isDukPay,
          isPay4Game: m.isPay4Game,
          code: m.code,
        }))
      );

      console.log(
        "🌐 Adding RUB API methods (Moneta/DukPay/Pay4Game):",
        methodsByCurrency.methods
      );

      // Create a Set of existing method names/IDs to avoid duplicates
      const existingMethodIds = new Set(
        availablePaymentMethods.map((m) => m.id.toLowerCase())
      );
      const existingMethodNames = new Set(
        availablePaymentMethods.map((m) => m.apiName.toLowerCase())
      );

      console.log("🔍 Existing method IDs:", Array.from(existingMethodIds));
      console.log("🔍 Existing method names:", Array.from(existingMethodNames));

      const apiMethods = methodsByCurrency.methods
        .filter((method) => {
          // Skip if method already exists by ID or name
          const methodId = (
            method.methodCode ||
            method.name ||
            ""
          ).toLowerCase();
          const methodName = (method.name || "").toLowerCase();

          // Check for exact duplicates
          const isDuplicateById = existingMethodIds.has(methodId);
          const isDuplicateByName = existingMethodNames.has(methodName);
          const isDuplicateByIdInName = existingMethodNames.has(methodId);

          // 🔥 IMPORTANT: Don't treat Pay4Game/DukPay/Moneta SBP as duplicates of Pagsmile SBP
          // They should coexist as different payment methods
          const isSbpVariant = (name: string) => {
            const lower = name.toLowerCase();
            return (
              lower.includes("sbp") ||
              lower.includes("сбп") ||
              lower.includes("система") ||
              lower === "sbp" ||
              lower === "сбп"
            );
          };

          // Only consider it a duplicate SBP if:
          // 1. Both are SBP variants
          // 2. Both are from the same provider (Pay4Game, DukPay, Moneta, or Pagsmile)
          const isDuplicateSbp =
            isSbpVariant(methodName) &&
            Array.from(availablePaymentMethods).some((existing) => {
              const existingIsSbp = isSbpVariant(existing.apiName);
              const sameProvider =
                (method.isPay4Game && existing.isPay4Game) ||
                (method.isDukPay && existing.isDukPay) ||
                (method.isMoneta && existing.isMoneta) ||
                (!method.isPay4Game &&
                  !method.isDukPay &&
                  !method.isMoneta &&
                  existing.isPagsmile);

              return existingIsSbp && sameProvider;
            });

          const isDuplicate =
            isDuplicateById ||
            isDuplicateByName ||
            isDuplicateByIdInName ||
            isDuplicateSbp;

          if (isDuplicate) {
            console.log(
              `⚠️ Skipping duplicate method: "${method.name}" (ID: ${method.methodCode})`,
              {
                isDuplicateById,
                isDuplicateByName,
                isDuplicateByIdInName,
                isDuplicateSbp,
                isMoneta: method.isMoneta,
                isDukPay: method.isDukPay,
                isPay4Game: method.isPay4Game,
              }
            );
          } else {
            console.log(
              `✅ Adding unique method: "${method.name}" (ID: ${method.methodCode})`,
              {
                isMoneta: method.isMoneta,
                isDukPay: method.isDukPay,
                isPay4Game: method.isPay4Game,
              }
            );
          }

          return !isDuplicate;
        })
        .map((method, index) => {
          const iconUrl = getIconUrl(method.icon);
          const fallbackIcon = getPaymentMethodIconSrc("card", method.name);
          const finalIcon = iconUrl || fallbackIcon;

          return {
            id: method.methodCode || method.name || `method-${index}`,
            translationKey: method.name,
            apiName: method.name,
            icon: finalIcon,
            description: method.description,
            isMoneta: method.isMoneta || false,
            isDukPay: method.isDukPay || false,
            isPay4Game: method.isPay4Game || false,
            code: method.code,
          };
        });

      console.log(
        "✅ Unique API methods to add:",
        apiMethods.map((m) => ({ id: m.id, apiName: m.apiName }))
      );
      availablePaymentMethods = [...availablePaymentMethods, ...apiMethods];
    }

    console.log(
      "📋 Final available methods for RUB:",
      availablePaymentMethods.map((m) => ({ id: m.id, apiName: m.apiName }))
    );
  }
  // For non-RUB currencies: Use API methods
  else if (methodsByCurrency && methodsByCurrency.methods.length > 0) {
    console.log("Processing methodsByCurrency:", methodsByCurrency.methods);
    availablePaymentMethods = methodsByCurrency.methods.map((method, index) => {
      console.log(`Processing method ${index}:`, method);
      const iconUrl = getIconUrl(method.icon);
      const fallbackIcon = getPaymentMethodIconSrc("card", method.name);
      const finalIcon = iconUrl || fallbackIcon;
      console.log(`Final icon for ${method.name}:`, finalIcon);

      return {
        id: method.methodCode || method.name || `method-${index}`,
        translationKey: method.name, // Используем название из API напрямую, без переводов
        apiName: method.name,
        icon: finalIcon,
        description: method.description, // Добавляем поле description из API
        isMoneta: method.isMoneta || false, // Add Moneta flag
        isDukPay: method.isDukPay || false, // Add DukPay flag
        isPay4Game: method.isPay4Game || false, // Add Pay4Game flag
        code: method.code, // Add payment method code
      };
    });
  }
  // Priority 2: Use user-specific methods if enabled
  else if (useUserMethods && userMethods) {
    availablePaymentMethods = userMethods.methods.map((methodName) => {
      // Добавляем проверку на undefined/null
      const safeMethodName = methodName || "";

      const frontendMethod = allPaymentMethods.find(
        (fm) =>
          fm.apiName === safeMethodName ||
          fm.translationKey.includes(safeMethodName.toLowerCase())
      );

      return (
        frontendMethod || {
          id: safeMethodName.toLowerCase().replace(/[^a-z0-9]/g, ""),
          translationKey: `methods.${safeMethodName.toLowerCase()}`,
          apiName: safeMethodName,
          icon: getPaymentMethodIconSrc("card", safeMethodName),
        }
      );
    });
  }
  // Priority 3: Use general API methods as fallback
  else if (apiPaymentMethods.length > 0) {
    availablePaymentMethods = apiPaymentMethods.map((apiMethod) => ({
      id: apiMethod.id,
      translationKey: `methods.${apiMethod.id}`,
      apiName: apiMethod.name,
      icon: getPaymentMethodIconSrc(apiMethod.type, apiMethod.name),
    }));
  }
  // Priority 4: Fallback to predefined methods with bank filtering (legacy for RUB)
  else {
    const filteredPaymentMethods = allPaymentMethods.filter((method) =>
      activeApiBankNames.includes(method.apiName)
    );
    availablePaymentMethods = filteredPaymentMethods;
  }

  const isLoading =
    banksLoading ||
    methodsLoading ||
    (useUserMethods && userMethodsLoading) ||
    currencyMethodsLoading;
  const error =
    banksError ||
    methodsError ||
    (useUserMethods && userMethodsError) ||
    currencyMethodsError;

  // Refetch methods when currency changes (for all currencies including RUB)
  useEffect(() => {
    if (activeCurrency) {
      console.log("Refetching methods for currency:", activeCurrency);
      refetchCurrencyMethods(activeCurrency);
    }
  }, [activeCurrency, refetchCurrencyMethods]);

  // Debug information
  useEffect(() => {
    console.log("PaymentMethodSelector Debug:", {
      currentCurrency,
      activeCurrency,
      region,
      useUserMethods,
      useCurrencyMethods,
      userMethods,
      methodsByCurrency,
      apiPaymentMethods,
      availablePaymentMethods,
      activeBanksResponse: activeBanksResponse?.data,
      isLoading,
      error,
      selectedMethod,
    });
  }, [
    currentCurrency,
    activeCurrency,
    region,
    useUserMethods,
    useCurrencyMethods,
    userMethods,
    methodsByCurrency,
    apiPaymentMethods,
    availablePaymentMethods,
    activeBanksResponse,
    isLoading,
    error,
    selectedMethod,
  ]);

  // Track selectedMethod changes
  useEffect(() => {
    console.log("🔄 selectedMethod prop changed:", {
      newValue: selectedMethod,
      type: typeof selectedMethod,
    });
  }, [selectedMethod]);

  // Автоматический выбор первого доступного метода оплаты - ОБЪЕДИНЕННАЯ ЛОГИКА
  useEffect(() => {
    if (!isLoading && availablePaymentMethods.length > 0) {
      const firstMethod = availablePaymentMethods[0];
      const firstMethodId = firstMethod.id;

      // Автоматически выбираем первый метод если:
      // 1. Нет выбранного метода (пустая строка, null, undefined)
      // 2. Выбранный метод не найден среди доступных
      const isSelectedMethodAvailable = availablePaymentMethods.some(
        (method) => method.id === selectedMethod
      );

      const shouldAutoSelect =
        !selectedMethod || selectedMethod === "" || !isSelectedMethodAvailable;

      if (shouldAutoSelect) {
        console.log("Auto-selecting payment method:", {
          firstMethodId,
          selectedMethod,
          availableMethodsCount: availablePaymentMethods.length,
          isSelectedMethodAvailable,
          shouldAutoSelect,
          isMoneta: firstMethod.isMoneta,
          isDukPay: firstMethod.isDukPay,
          isPay4Game: firstMethod.isPay4Game,
          code: firstMethod.code,
        });
        // Вызываем onSelect напрямую без setTimeout
        onSelect(
          firstMethodId,
          firstMethod.isMoneta,
          firstMethod.code,
          firstMethod.isDukPay,
          firstMethod.isPay4Game
        );
      }
    }
  }, [availablePaymentMethods, isLoading, selectedMethod]); // Убираем onSelect из зависимостей

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-700">
          {i18n("loadingMethods") || "Loading payment methods..."}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 p-4 rounded-md text-red-700">
        {i18n("errorLoadingMethods") ||
          "Failed to load payment methods. Please try again later."}
      </div>
    );
  }

  if (availablePaymentMethods.length === 0 && !isLoading) {
    return (
      <div className="border border-yellow-300 bg-yellow-50 p-4 rounded-md text-yellow-700">
        {i18n("noMethodsAvailable") ||
          "No payment methods are currently available."}
      </div>
    );
  }

  // 🔥 AGGRESSIVE FINAL DEDUPLICATION - Remove duplicates but keep different providers
  const uniquePaymentMethods = availablePaymentMethods.reduce((acc, method) => {
    // Helper to check if method is SBP variant
    const isSbpVariant = (name: string) => {
      const lower = name.toLowerCase();
      return (
        lower.includes("sbp") ||
        lower.includes("сбп") ||
        lower === "sbp" ||
        lower === "сбп"
      );
    };

    const isDuplicate = acc.some((existing) => {
      // Exact ID match (case-insensitive)
      if (existing.id.toLowerCase() === method.id.toLowerCase()) {
        return true;
      }

      // For SBP variants, only consider duplicate if from same provider
      if (isSbpVariant(method.apiName) && isSbpVariant(existing.apiName)) {
        const sameProvider =
          (method.isPay4Game && existing.isPay4Game) ||
          (method.isDukPay && existing.isDukPay) ||
          (method.isMoneta && existing.isMoneta) ||
          (method.isPagsmile && existing.isPagsmile) ||
          // If both don't have provider flags, treat as same
          (!method.isPay4Game &&
            !method.isDukPay &&
            !method.isMoneta &&
            !method.isPagsmile &&
            !existing.isPay4Game &&
            !existing.isDukPay &&
            !existing.isMoneta &&
            !existing.isPagsmile);

        return sameProvider;
      }

      // For non-SBP methods, check API name match
      if (
        existing.apiName &&
        method.apiName &&
        existing.apiName.toLowerCase() === method.apiName.toLowerCase() &&
        !isSbpVariant(method.apiName)
      ) {
        return true;
      }

      return false;
    });

    if (!isDuplicate) {
      acc.push(method);
    } else {
      console.log(
        `🗑️ Removing final duplicate: "${method.id}" (apiName: ${method.apiName}, isPay4Game: ${method.isPay4Game}, isDukPay: ${method.isDukPay}, isMoneta: ${method.isMoneta}, isPagsmile: ${method.isPagsmile})`
      );
    }

    return acc;
  }, [] as FrontendPaymentMethod[]);

  console.log(
    "🎯 Final unique payment methods:",
    uniquePaymentMethods.map((m) => ({ id: m.id, apiName: m.apiName }))
  );

  const paymentMethodSelectorContent = (
    <div className="space-y-3">
      {uniquePaymentMethods.map((method) => {
        // Strict comparison with type checking and normalization
        const normalizedMethodId = method.id?.toLowerCase() || "";
        const normalizedSelectedMethod = selectedMethod?.toLowerCase() || "";
        const isSelected =
          normalizedSelectedMethod !== "" &&
          normalizedMethodId === normalizedSelectedMethod;

        console.log(`🎨 Rendering payment method "${method.id}":`, {
          methodId: method.id,
          normalizedMethodId,
          methodIdType: typeof method.id,
          selectedMethod,
          normalizedSelectedMethod,
          selectedMethodType: typeof selectedMethod,
          isSelected,
          comparisonResult: normalizedMethodId === normalizedSelectedMethod,
        });

        return (
          <div
            key={method.id}
            className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${
              isSelected
                ? "bg-blue-500/5 border-blue-500"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => {
              console.log(`🖱️ Payment method clicked: "${method.id}"`, {
                id: method.id,
                apiName: method.apiName,
                isMoneta: method.isMoneta,
                isDukPay: method.isDukPay,
                isPay4Game: method.isPay4Game,
                code: method.code,
              });
              onSelect(
                method.id,
                method.isMoneta,
                method.code,
                method.isDukPay,
                method.isPay4Game
              );
            }}
            role="radio"
            aria-checked={!!isSelected}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                onSelect(
                  method.id,
                  method.isMoneta,
                  method.code,
                  method.isDukPay,
                  method.isPay4Game
                );
            }}
          >
            <div className="w-10 h-10 rounded-md flex items-center justify-center mr-4 bg-gray-100">
              <Image
                src={(() => {
                  const iconSrc = getIconSrc(method.icon) || "/placeholder.svg";
                  console.log(
                    `Image src for ${method.translationKey}:`,
                    iconSrc
                  );
                  return iconSrc;
                })()}
                width={24}
                height={24}
                alt={
                  method.translationKey.startsWith("methods.")
                    ? i18n(method.translationKey)
                    : method.translationKey
                }
                onLoad={() =>
                  console.log(
                    `✅ Image loaded successfully for ${method.translationKey}`
                  )
                }
                onError={(e) => {
                  console.error(
                    `❌ Image failed to load for ${method.translationKey}:`,
                    e
                  );
                  console.error("Failed src:", getIconSrc(method.icon));
                  // Fallback test with regular img tag
                  if (typeof window !== "undefined") {
                    const testImg = document.createElement("img");
                    testImg.onload = () =>
                      console.log("✅ Regular img tag loaded successfully");
                    testImg.onerror = () =>
                      console.error("❌ Regular img tag also failed");
                    testImg.src = getIconSrc(method.icon);
                  }
                }}
                unoptimized={true}
              />
            </div>
            <div className="flex-1">
              <span className="font-medium text-gray-800">
                {method.translationKey.startsWith("methods.")
                  ? i18n(method.translationKey)
                  : method.translationKey}
              </span>
              {/* Показываем описание из API если есть */}
              {method.description && (
                <p className="text-xs text-gray-500 mt-1">
                  {method.description}
                </p>
              )}
              {/* Показываем описание из переводов если есть и нет description из API */}
              {!method.description && method.descriptionKey && (
                <p className="text-xs text-gray-500 mt-1">
                  {i18n(method.descriptionKey)}
                </p>
              )}
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
              {isSelected && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div className={`${enhanced ? "hidden" : "block"}  mb-6 md:hidden`}>
        {paymentMethodSelectorContent}
      </div>
      <div className={`${enhanced ? "block" : "hidden md:block"}`}>
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {i18n("titleDesktop")}
        </h2>
        {paymentMethodSelectorContent}
      </div>
    </>
  );
}
