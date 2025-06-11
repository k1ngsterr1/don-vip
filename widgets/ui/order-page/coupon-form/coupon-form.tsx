"use client";

import type React from "react";

import { Loader2, Check, AlertCircle, Tag, Percent, Lock } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { CustomTooltip } from "@/shared/ui/tooltip/tooltip";
import { useEffect, useState } from "react";
import { CustomAlert } from "../alert/alert";
import QuestionIcon from "@/shared/icons/question-icon";
import { useCouponValidation } from "@/entities/coupons/hooks/use-coupon-validation";
import { extractErrorMessage } from "@/shared/config/apiClient";

interface CouponFormProps {
  couponCode: string;
  onCouponCodeChange: (value: string) => void;
  onAgreeChange: (value: boolean) => void;
  onCouponApplied?: (discount: number, couponInfo: any) => void;
  isAvailable?: boolean; // New prop to control availability
}

export function CouponForm({
  couponCode,
  onCouponCodeChange,
  onAgreeChange,
  onCouponApplied,
  isAvailable = true, // Default to available
}: CouponFormProps) {
  const locale = useLocale();
  const t = useTranslations("orderBlock.coupon");
  const tError = useTranslations("alert.validation");

  // Translations for hardcoded messages
  const messages = {
    en: {
      notAvailable: "Not Available",
      couponUnavailable: "Coupon codes unavailable",
      couponNotAvailable: "Coupon codes are not available for this order",
      couponNotAvailableTooltip:
        "Coupon codes are not available for this order type.",
      couponAppliedSuccess: "Coupon Applied Successfully!",
      discountApplied: "discount applied",
      expires: "Expires:",
    },
    ru: {
      notAvailable: "Недоступно",
      couponUnavailable: "Купоны недоступны",
      couponNotAvailable: "Купоны недоступны для этого заказа",
      couponNotAvailableTooltip: "Купоны недоступны для этого типа заказа.",
      couponAppliedSuccess: "Купон успешно применен!",
      discountApplied: "скидка применена",
      expires: "Истекает:",
    },
  };

  // Get translations based on current locale
  const msg = locale === "ru" ? messages.ru : messages.en;

  const [couponInput, setCouponInput] = useState(couponCode);
  const [shouldValidate, setShouldValidate] = useState(false);
  const [couponInfo, setCouponInfo] = useState<{
    code?: string;
    discount?: number;
    type?: "percentage" | "fixed";
    description?: string;
    expiresAt?: string;
  } | null>(null);
  const [validationError, setValidationError] = useState("");
  const [validationErrorCode, setValidationErrorCode] = useState<number | null>(
    null
  );
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // Use TanStack Query for coupon validation
  const {
    data: validationData,
    error: queryError,
    isLoading: isValidating,
    isError,
    refetch,
  } = useCouponValidation(
    couponInput.trim().toUpperCase(),
    shouldValidate && isAvailable
  );

  useEffect(() => {
    if (
      couponInput !== couponCode &&
      !validationError &&
      couponInfo &&
      isAvailable
    ) {
      onCouponCodeChange(couponInput);
    }
  }, [
    couponInput,
    couponCode,
    validationError,
    couponInfo,
    onCouponCodeChange,
    isAvailable,
  ]);

  // Handle validation results
  useEffect(() => {
    if (!shouldValidate || !isAvailable) return;

    if (isError && queryError) {
      const errorMessage = extractErrorMessage(queryError);
      let errorCode = -500;

      // Extract error code from axios error
      if (
        queryError &&
        typeof queryError === "object" &&
        "response" in queryError
      ) {
        const axiosError = queryError as any;
        switch (axiosError.response?.status) {
          case 404:
            errorCode = -404;
            setValidationError(
              locale === "ru" ? "Купон не найден" : "Coupon code not found"
            );
            break;
          case 410:
            errorCode = -410;
            setValidationError(
              locale === "ru"
                ? "Срок действия купона истек"
                : "Coupon has expired"
            );
            break;
          case 409:
            errorCode = -409;
            setValidationError(
              locale === "ru"
                ? "Купон уже использован"
                : "Coupon has already been used"
            );
            break;
          case 400:
            errorCode = -400;
            setValidationError(
              locale === "ru"
                ? "Неверный формат купона"
                : "Invalid coupon code format"
            );
            break;
          default:
            errorCode = -500;
            setValidationError(
              errorMessage ||
                (locale === "ru"
                  ? "Не удалось проверить купон"
                  : "Failed to validate coupon")
            );
        }
      } else {
        setValidationError(
          errorMessage ||
            (locale === "ru"
              ? "Произошла сетевая ошибка"
              : "Network error occurred")
        );
      }

      setValidationErrorCode(errorCode);
      setShowErrorAlert(true);
      setCouponInfo(null);
      setShouldValidate(false);
      return;
    }

    if (validationData) {
      if (validationData.status === "Active" || validationData.valid) {
        const couponData = {
          code: couponInput.trim().toUpperCase(),
          discount: validationData.discount || validationData.amount || 0,
          type: validationData.type || "percentage", // Default to percentage since your API shows discount as number
          expiresAt: validationData.expires_at || validationData.expiry_date,
        };

        setCouponInfo(couponData as any);
        setValidationError("");
        setValidationErrorCode(null);

        if (onCouponApplied) {
          onCouponApplied(couponData.discount, couponData);
        }
      } else {
        setValidationError(
          validationData.message ||
            (locale === "ru"
              ? "Недействительный код купона"
              : "Invalid coupon code")
        );
        setValidationErrorCode(validationData.error_code || -400);
        setShowErrorAlert(true);
        setCouponInfo(null);
      }
      setShouldValidate(false);
    }
  }, [
    validationData,
    isError,
    queryError,
    shouldValidate,
    couponInput,
    onCouponApplied,
    isAvailable,
    locale,
  ]);

  const handleValidateCoupon = async () => {
    if (!isAvailable) return;

    const trimmed = couponInput.trim().toUpperCase();

    if (!trimmed) return;

    // Reset previous state
    setCouponInfo(null);
    setValidationError("");
    setValidationErrorCode(null);

    // Trigger validation
    setShouldValidate(true);

    // If we already have this query cached, refetch it
    if (validationData || queryError) {
      refetch();
    }
  };

  const handleCheckboxValidation = async (checked: boolean) => {
    if (!isAvailable) return;

    onAgreeChange(checked);

    // Validate coupon when checkbox is checked and there's a coupon code
    if (checked && couponInput.trim() && !couponInfo) {
      await handleValidateCoupon();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAvailable) return;

    const upperValue = e.target.value.toUpperCase();
    setCouponInput(upperValue);
    setCouponInfo(null);
    setValidationError("");
    setValidationErrorCode(null);
    setShouldValidate(false);
  };

  const getFormattedErrorMessage = () => {
    const errorMessages = {
      en: {
        couponNotFound: "Coupon code not found",
        couponExpired: "Coupon has expired",
        couponAlreadyUsed: "Coupon has already been used",
        invalidCoupon: "Invalid coupon code format",
        networkError: "Network error occurred",
        validationFailed: "Validation failed",
      },
      ru: {
        couponNotFound: "Купон не найден",
        couponExpired: "Срок действия купона истек",
        couponAlreadyUsed: "Купон уже использован",
        invalidCoupon: "Неверный формат купона",
        networkError: "Произошла сетевая ошибка",
        validationFailed: "Проверка не удалась",
      },
    };

    const errors = locale === "ru" ? errorMessages.ru : errorMessages.en;

    switch (validationErrorCode) {
      case -404:
        return tError("couponNotFound") || errors.couponNotFound;
      case -410:
        return tError("couponExpired") || errors.couponExpired;
      case -409:
        return tError("couponAlreadyUsed") || errors.couponAlreadyUsed;
      case -400:
        return tError("invalidCoupon") || errors.invalidCoupon;
      case -500:
        return tError("networkError") || errors.networkError;
      default:
        return (
          validationError ||
          tError("validationFailed") ||
          errors.validationFailed
        );
    }
  };

  const formatDiscount = (discount: number, type: "percentage" | "fixed") => {
    return type === "percentage" ? `${discount}%` : `$${discount}`;
  };

  return (
    <div className={`px-4 mb-6 ${!isAvailable ? "opacity-80" : ""}`}>
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          {isAvailable ? (
            <Tag className="h-5 w-5 text-[#6798de] mr-2" />
          ) : (
            <Lock className="h-5 w-5 text-gray-400 mr-2" />
          )}
          <h2
            className={`font-roboto font-medium ${
              isAvailable ? "text-dark" : "text-gray-500"
            }`}
          >
            {t("enterCouponCode") ||
              (locale === "ru" ? "Введите код купона" : "Enter Coupon Code")}
            {!isAvailable && (
              <span className="text-xs text-gray-400 ml-2">
                ({msg.notAvailable})
              </span>
            )}
          </h2>
        </div>
        <CustomTooltip
          content={
            <div className="p-1">
              {isAvailable
                ? t("tooltipText") ||
                  (locale === "ru"
                    ? "Введите действительный код купона, чтобы применить скидки к вашему заказу. Коды купонов нечувствительны к регистру и будут автоматически проверены."
                    : "Enter a valid coupon code to apply discounts to your order. Coupon codes are case-insensitive and will be automatically validated.")
                : msg.couponNotAvailableTooltip}
            </div>
          }
          position="top"
          delay={300}
        >
          <QuestionIcon className="ml-2" />
        </CustomTooltip>
      </div>

      {!isAvailable && (
        <div className="mb-4 p-3 bg-gray-100 border border-gray-200 rounded-lg flex items-center text-gray-600">
          <Lock size={16} className="mr-2" />
          <span className="text-sm">{msg.couponNotAvailable}</span>
        </div>
      )}

      <div className="space-y-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {isAvailable ? (
              <Tag size={18} className="text-gray-400" />
            ) : (
              <Lock size={18} className="text-gray-400" />
            )}
          </div>
          <input
            type="text"
            placeholder={
              isAvailable
                ? t("couponPlaceholder") ||
                  (locale === "ru"
                    ? "Введите код купона (напр., SAVE10)"
                    : "Enter coupon code (e.g., SAVE10)")
                : msg.couponUnavailable
            }
            value={couponInput}
            onChange={handleInputChange}
            onBlur={handleValidateCoupon}
            disabled={!isAvailable}
            className={`w-full p-3 pl-12 border rounded-lg uppercase tracking-wider font-mono transition-colors ${
              !isAvailable
                ? "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed"
                : validationError
                ? "border-red-500"
                : couponInfo
                ? "border-green-500"
                : "border-gray-200"
            }`}
          />
          {isValidating && isAvailable && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 size={18} className="animate-spin text-blue-500" />
            </div>
          )}
          {couponInfo && !isValidating && isAvailable && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Check size={18} className="text-green-500" />
            </div>
          )}
          {validationError && !isValidating && isAvailable && (
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowErrorAlert(true)}
            >
              <AlertCircle size={18} className="text-red-500" />
            </div>
          )}
        </div>

        {/* Show coupon info only when available */}
        {couponInfo && isAvailable && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-700">
              <Check size={16} className="mr-2" />
              <span className="font-medium">{msg.couponAppliedSuccess}</span>
            </div>
            <div className="mt-1 text-sm text-green-600">
              <div className="flex items-center">
                <Percent size={14} className="mr-1" />
                <span>
                  {formatDiscount(
                    couponInfo.discount || 0,
                    couponInfo.type || "percentage"
                  )}{" "}
                  {msg.discountApplied}
                </span>
              </div>
              {couponInfo.expiresAt && (
                <div className="text-xs text-green-500 mt-1">
                  {msg.expires}{" "}
                  {new Date(couponInfo.expiresAt).toLocaleDateString(locale)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Show error alert only when available */}
      {isAvailable && (
        <CustomAlert
          isOpen={showErrorAlert}
          onClose={() => setShowErrorAlert(false)}
          message={getFormattedErrorMessage()}
        />
      )}
    </div>
  );
}
