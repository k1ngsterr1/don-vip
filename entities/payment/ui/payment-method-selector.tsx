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
    code?: string | null,
    isDukPay?: boolean
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
  code?: string | null; // Payment method code for Moneta/DukPay
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
    methodType?: string | null,
    methodName?: string | null
  ): StaticImageData => {
    // Добавляем проверки на undefined/null
    const safeMethodType = methodType?.toString() ?? "";
    const safeMethodName = methodName?.toString() ?? "";

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
    methodType?: string | null,
    methodName?: string | null
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
      id: "sbp",
      translationKey: "methods.sbp",
      apiName: "SBP",
      icon: sbpIcon,
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

  // For RUB currency: Combine local methods (SBP, T-Bank) with API methods (Moneta)
  if (activeCurrency === "RUB") {
    // First add filtered local methods (SBP, T-Bank)
    const filteredLocalMethods = allPaymentMethods.filter((method) =>
      activeApiBankNames.includes(method.apiName)
    );
    availablePaymentMethods = [...filteredLocalMethods];

    // Then add API methods (including Moneta methods) if available
    if (methodsByCurrency && methodsByCurrency.methods.length > 0) {
      console.log(
        "Adding RUB API methods (Moneta):",
        methodsByCurrency.methods
      );
      const apiMethods = methodsByCurrency.methods.map((method, index) => {
        // Ensure all required properties are defined with fallbacks
        const methodName = method.name ?? `Payment Method ${index + 1}`;
        const methodCode =
          method.methodCode ?? method.code ?? `method-${index}`;
        const methodIcon = method.icon ?? null;

        const iconUrl = getIconUrl(methodIcon);
        const fallbackIcon = getPaymentMethodIconSrc("card", methodName);
        const finalIcon = iconUrl || fallbackIcon;

        return {
          id: methodCode,
          translationKey: methodName,
          apiName: methodName,
          icon: finalIcon,
          description: method.description ?? undefined,
          isMoneta: method.isMoneta ?? false,
          isDukPay: method.isDukPay ?? false,
          code: method.code,
        };
      });
      availablePaymentMethods = [...availablePaymentMethods, ...apiMethods];
    }
  }
  // For non-RUB currencies: Use API methods
  else if (methodsByCurrency && methodsByCurrency.methods.length > 0) {
    console.log("Processing methodsByCurrency:", methodsByCurrency.methods);
    availablePaymentMethods = methodsByCurrency.methods.map((method, index) => {
      console.log(`Processing method ${index}:`, method);

      // Ensure all required properties are defined with fallbacks
      const methodName = method.name ?? `Payment Method ${index + 1}`;
      const methodCode = method.methodCode ?? method.code ?? `method-${index}`;
      const methodIcon = method.icon ?? null;

      const iconUrl = getIconUrl(methodIcon);
      const fallbackIcon = getPaymentMethodIconSrc("card", methodName);
      const finalIcon = iconUrl || fallbackIcon;
      console.log(`Final icon for ${methodName}:`, finalIcon);

      return {
        id: methodCode,
        translationKey: methodName, // Используем название из API напрямую, без переводов
        apiName: methodName,
        icon: finalIcon,
        description: method.description ?? undefined, // Добавляем поле description из API
        isMoneta: method.isMoneta ?? false, // Add Moneta flag
        isDukPay: method.isDukPay ?? false, // Add DukPay flag
        code: method.code, // Add payment method code
      };
    });
  }
  // Priority 2: Use user-specific methods if enabled
  else if (useUserMethods && userMethods) {
    availablePaymentMethods = userMethods.methods.map((methodName) => {
      // Добавляем проверку на undefined/null
      const safeMethodName = methodName?.toString() ?? "Unknown Method";

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
  ]);

  // Автоматический выбор первого доступного метода оплаты
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
          code: firstMethod.code,
        });
        // Используем setTimeout чтобы гарантировать, что состояние обновится
        setTimeout(() => {
          onSelect(
            firstMethodId,
            firstMethod.isMoneta,
            firstMethod.code,
            firstMethod.isDukPay
          );
        }, 0);
      }
    }
  }, [availablePaymentMethods, isLoading, selectedMethod, onSelect]);

  // Дополнительный эффект для принудительного автовыбора
  useEffect(() => {
    if (!isLoading && availablePaymentMethods.length > 0 && !selectedMethod) {
      const firstMethodId = availablePaymentMethods[0].id;
      console.log("Force auto-selecting first payment method:", firstMethodId);
      onSelect(firstMethodId);
    }
  }, [availablePaymentMethods, isLoading, selectedMethod, onSelect]);

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

  const paymentMethodSelectorContent = (
    <div className="space-y-3">
      {availablePaymentMethods.map((method) => (
        <div
          key={method.id}
          className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${
            method.id === selectedMethod
              ? "bg-blue-500/5 border-blue-500" // Original: bg-blue/5 border-blue. Adjusted blue intensity for visibility.
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() =>
            onSelect(method.id, method.isMoneta, method.code, method.isDukPay)
          }
          role="radio"
          aria-checked={method.id === selectedMethod}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              onSelect(
                method.id,
                method.isMoneta,
                method.code,
                method.isDukPay
              );
          }}
        >
          <div className="w-10 h-10 rounded-md flex items-center justify-center mr-4 bg-gray-100">
            <Image
              src={(() => {
                const iconSrc = getIconSrc(method.icon) || "/placeholder.svg";
                console.log(`Image src for ${method.translationKey}:`, iconSrc);
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
              <p className="text-xs text-gray-500 mt-1">{method.description}</p>
            )}
            {/* Показываем описание из переводов если есть и нет description из API */}
            {!method.description && method.descriptionKey && (
              <p className="text-xs text-gray-500 mt-1">
                {i18n(method.descriptionKey)}
              </p>
            )}
          </div>
          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
            {method.id === selectedMethod && (
              <div className="w-3 h-3 rounded-full bg-blue-500"></div> // Original: bg-blue. Adjusted to bg-blue-500 for consistency.
            )}
          </div>
        </div>
      ))}
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
