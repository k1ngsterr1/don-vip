"use client";

import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import tbankIcon from "@/assets/T-Bank.webp";
import mastercardIcon from "@/assets/mastercard.webp";
import visaIcon from "@/assets/visa.webp";
import sbpIcon from "@/assets/sbp.svg";
import paypalIcon from "@/assets/paypal.webp";
import { useGetActiveBanks } from "@/entities/bank/hooks/use-get-active-banks";
import { usePaymentMethods } from "@/entities/payment/hooks/use-payment-methods";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface PaymentMethodSelectorProps {
  enhanced?: boolean;
  selectedMethod?: string;
  onSelect?: (method: string) => void;
  currentCurrency?: string; // Add currency prop
  region?: string; // Add region prop
  amount?: number; // Add amount prop for filtering
}

interface FrontendPaymentMethod {
  id: string;
  translationKey: string; // To get the display name via i18n
  apiName: string; // Name used in the API for matching
  icon: StaticImageData;
  descriptionKey?: string;
}

export function PaymentMethodSelector({
  enhanced = false,
  selectedMethod = "tbank", // Default selected method ID
  onSelect = () => {},
  currentCurrency = "RUB", // Default to RUB
  region = "RU", // Default to Russia
  amount, // Amount for filtering
}: PaymentMethodSelectorProps) {
  const i18n = useTranslations("PaymentMethodSelector");

  // Function to get appropriate icon for payment method
  const getPaymentMethodIcon = (
    methodType: string,
    methodName: string
  ): StaticImageData => {
    const lowerType = methodType.toLowerCase();
    const lowerName = methodName.toLowerCase();

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
    currency: currentCurrency,
    region: region,
    amount: amount,
  });

  // Define frontend payment methods with a mapping to API names
  const allPaymentMethods: FrontendPaymentMethod[] = [
    {
      id: "tbank",
      translationKey: "methods.tbank",
      apiName: "T-Bank", // Example: This should match the 'name' field from your Bank API for T-Bank
      icon: tbankIcon,
      descriptionKey: "tbankDescription",
    },
    {
      id: "sbp",
      translationKey: "methods.sbp",
      apiName: "SBP",
      icon: sbpIcon,
    },
    {
      id: "card",
      translationKey: "methods.card",
      apiName: "Card",
      icon: mastercardIcon,
    },
    // Add other payment methods here if needed
  ];

  const activeApiBankNames =
    activeBanksResponse?.data.map((bank) => bank.name) || [];

  // For non-RUB currencies, use payment methods from API
  let availablePaymentMethods: FrontendPaymentMethod[] = [];

  if (currentCurrency !== "RUB") {
    // For non-RUB currencies, map API payment methods to frontend format
    availablePaymentMethods = apiPaymentMethods.map((apiMethod) => ({
      id: apiMethod.id,
      translationKey: `methods.${apiMethod.id}`, // Use ID as translation key first, fallback to type
      apiName: apiMethod.name,
      icon: getPaymentMethodIcon(apiMethod.type, apiMethod.name),
    }));

    // If no translation found for ID, try using type
    availablePaymentMethods = availablePaymentMethods.map((method) => {
      // Check if translation exists for the ID, if not, use type
      const translationWithId = i18n.raw(`methods.${method.id}`);
      if (!translationWithId || translationWithId === `methods.${method.id}`) {
        const apiMethod = apiPaymentMethods.find((api) => api.id === method.id);
        return {
          ...method,
          translationKey: `methods.${apiMethod?.type || "card"}`,
        };
      }
      return method;
    });
  } else {
    // For RUB currency, use the original logic with banks
    const filteredPaymentMethods = allPaymentMethods.filter((method) => {
      if (method.id === "tbank" && currentCurrency !== "RUB") {
        return false; // Hide T-Bank for non-RUB currencies
      }
      return true;
    });

    availablePaymentMethods = filteredPaymentMethods.filter((method) =>
      activeApiBankNames.includes(method.apiName)
    );
  }

  const isLoading = banksLoading || methodsLoading;
  const error = banksError || methodsError;

  // Debug information
  useEffect(() => {
    console.log("PaymentMethodSelector Debug:", {
      currentCurrency,
      region,
      apiPaymentMethods,
      availablePaymentMethods,
      activeBanksResponse: activeBanksResponse?.data,
      isLoading,
      error,
    });
  }, [
    currentCurrency,
    region,
    apiPaymentMethods,
    availablePaymentMethods,
    activeBanksResponse,
    isLoading,
    error,
  ]);

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

  // Check if T-Bank is filtered out due to currency
  const isTBankHidden =
    currentCurrency !== "RUB" &&
    allPaymentMethods.some((method) => method.id === "tbank");

  const paymentMethodSelectorContent = (
    <div className="space-y-3">
      {/* Show info message if T-Bank is hidden */}
      {isTBankHidden && (
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-700">
          <div className="flex items-center">
            <div className="text-blue-500 mr-2">ℹ️</div>
            <span>{i18n("tbankUnavailableInfo")}</span>
          </div>
        </div>
      )}

      {availablePaymentMethods.map((method) => (
        <div
          key={method.id}
          className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${
            method.id === selectedMethod
              ? "bg-blue-500/5 border-blue-500" // Original: bg-blue/5 border-blue. Adjusted blue intensity for visibility.
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => onSelect(method.id)}
          role="radio"
          aria-checked={method.id === selectedMethod}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onSelect(method.id);
          }}
        >
          <div className="w-10 h-10 rounded-md flex items-center justify-center mr-4 bg-gray-100">
            <Image
              src={method.icon || "/placeholder.svg"}
              width={24}
              height={24}
              alt={i18n(method.translationKey)}
            />
          </div>
          <div className="flex-1">
            <span className="font-medium text-gray-800">
              {i18n(method.translationKey)}
            </span>
            {method.descriptionKey && (
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
      <div className={`${enhanced ? "hidden" : "block"} px-4 mb-6 md:hidden`}>
        <h2 className="text-gray-900 font-medium mb-4">
          {/* Original: text-dark. Changed to text-gray-900 for consistency or use your custom 'text-dark' */}
          {i18n("titleMobile")}
        </h2>
        {paymentMethodSelectorContent}
      </div>
      <div className={`${enhanced ? "block" : "hidden md:block"}`}>
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          {i18n("titleDesktop")}
        </h2>
        {paymentMethodSelectorContent}
      </div>
    </>
  );
}
