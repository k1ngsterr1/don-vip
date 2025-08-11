"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePaymentMethods } from "@/entities/payment/hooks/use-payment-methods";
import { Loader2, CreditCard, Star, Shield } from "lucide-react";
import { useState } from "react";
import type { PaymentMethod } from "@/entities/payment/api/payment-methods-api";

interface EnhancedPaymentMethodSelectorProps {
  selectedMethod?: string;
  onSelect?: (method: PaymentMethod) => void;
  currentCurrency?: string;
  region?: string;
  amount?: number;
  showRecommended?: boolean;
  showFallback?: boolean;
}

export function EnhancedPaymentMethodSelector({
  selectedMethod,
  onSelect = () => {},
  currentCurrency = "USD",
  region = "North America",
  amount,
  showRecommended = true,
  showFallback = true,
}: EnhancedPaymentMethodSelectorProps) {
  const i18n = useTranslations("PaymentMethodSelector");
  const [selected, setSelected] = useState<string | undefined>(selectedMethod);

  const {
    paymentMethods,
    recommendedMethods,
    fallbackMethods,
    userInfo,
    isLoading,
    error,
    refetch,
  } = usePaymentMethods({
    currency: currentCurrency,
    region: region,
    amount: amount,
  });

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelected(method.id);
    onSelect(method);
  };

  const renderPaymentMethod = (
    method: PaymentMethod,
    isRecommended = false
  ) => {
    const isSelected = selected === method.id;

    return (
      <div
        key={method.id}
        className={`
          relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
          ${
            isSelected
              ? "border-blue-500 bg-blue-50 shadow-md"
              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
          }
          ${isRecommended ? "ring-2 ring-green-200" : ""}
        `}
        onClick={() => handleMethodSelect(method)}
      >
        {/* Recommended badge */}
        {isRecommended && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            {i18n("recommended") || "Recommended"}
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Payment method icon */}
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {method.type === "card" ? (
              <CreditCard className="w-6 h-6 text-gray-600" />
            ) : (
              <Shield className="w-6 h-6 text-gray-600" />
            )}
          </div>

          {/* Method details */}
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{method.name}</h3>
            <div className="text-sm text-gray-500 space-y-1">
              <p>
                {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
              </p>
              <p>
                {method.currency} • {method.region}
              </p>
              {method.processing_fee && (
                <p className="text-orange-600">
                  {i18n("processingFee") || "Fee"}: {method.processing_fee}
                </p>
              )}
            </div>
          </div>

          {/* Selection indicator */}
          <div
            className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center
            ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"}
          `}
          >
            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-700">
          {i18n("loadingMethods") || "Loading payment methods..."}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          {i18n("retry") || "Try again"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User info */}
      {userInfo && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {i18n("userRegion") || "Region"}: {userInfo.region} •{" "}
            {userInfo.currency}
            {userInfo.country && ` • ${userInfo.country}`}
          </p>
        </div>
      )}

      {/* Recommended methods */}
      {showRecommended && recommendedMethods.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-green-500" />
            {i18n("recommendedMethods") || "Recommended Methods"}
          </h3>
          <div className="space-y-3">
            {recommendedMethods.map((method) =>
              renderPaymentMethod(method, true)
            )}
          </div>
        </div>
      )}

      {/* All available methods */}
      {paymentMethods.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {i18n("availableMethods") || "Available Methods"}
          </h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => renderPaymentMethod(method))}
          </div>
        </div>
      )}

      {/* Fallback methods */}
      {showFallback && fallbackMethods.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {i18n("fallbackMethods") || "Alternative Options"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {fallbackMethods.map((method, index) => (
              <div
                key={index}
                className="p-3 bg-gray-100 rounded-lg text-center text-sm text-gray-600"
              >
                {method}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No methods available */}
      {paymentMethods.length === 0 && recommendedMethods.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          <p>
            {i18n("noMethodsAvailable") ||
              "No payment methods available for your region"}
          </p>
        </div>
      )}
    </div>
  );
}
