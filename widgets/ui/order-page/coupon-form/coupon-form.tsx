"use client";

import { Loader2, Check, AlertCircle, Tag, Percent } from "lucide-react";
import { useTranslations } from "next-intl";
import { CustomTooltip } from "@/shared/ui/tooltip/tooltip";
import { useEffect, useState } from "react";
import { CustomAlert } from "../alert/alert";
import QuestionIcon from "@/shared/icons/question-icon";
import { useCouponValidation } from "@/entities/coupons/hooks/use-coupon-validation";
import { extractErrorMessage } from "@/shared/config/apiClient";

interface CouponFormProps {
  couponCode: string;
  agreeToTerms: boolean;
  onCouponCodeChange: (value: string) => void;
  onAgreeChange: (value: boolean) => void;
  onCouponApplied?: (discount: number, couponInfo: any) => void;
}

export function CouponForm({
  couponCode,
  agreeToTerms,
  onCouponCodeChange,
  onAgreeChange,
  onCouponApplied,
}: CouponFormProps) {
  const t = useTranslations("orderBlock.coupon");
  const tError = useTranslations("alert.validation");

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
  } = useCouponValidation(couponInput.trim().toUpperCase(), shouldValidate);

  useEffect(() => {
    if (couponInput !== couponCode && !validationError && couponInfo) {
      onCouponCodeChange(couponInput);
    }
  }, [
    couponInput,
    couponCode,
    validationError,
    couponInfo,
    onCouponCodeChange,
  ]);

  // Handle validation results
  useEffect(() => {
    if (!shouldValidate) return;

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
            setValidationError("Coupon code not found");
            break;
          case 410:
            errorCode = -410;
            setValidationError("Coupon has expired");
            break;
          case 409:
            errorCode = -409;
            setValidationError("Coupon has already been used");
            break;
          case 400:
            errorCode = -400;
            setValidationError("Invalid coupon code format");
            break;
          default:
            errorCode = -500;
            setValidationError(errorMessage || "Failed to validate coupon");
        }
      } else {
        setValidationError(errorMessage || "Network error occurred");
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
        setValidationError(validationData.message || "Invalid coupon code");
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
  ]);

  const handleValidateCoupon = async () => {
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
    onAgreeChange(checked);

    // Validate coupon when checkbox is checked and there's a coupon code
    if (checked && couponInput.trim() && !couponInfo) {
      await handleValidateCoupon();
    }
  };

  const getFormattedErrorMessage = () => {
    switch (validationErrorCode) {
      case -404:
        return tError("couponNotFound") || "Coupon code not found";
      case -410:
        return tError("couponExpired") || "Coupon has expired";
      case -409:
        return tError("couponAlreadyUsed") || "Coupon has already been used";
      case -400:
        return tError("invalidCoupon") || "Invalid coupon code format";
      case -500:
        return tError("networkError") || "Network error occurred";
      default:
        return (
          validationError || tError("validationFailed") || "Validation failed"
        );
    }
  };

  const formatDiscount = (discount: number, type: "percentage" | "fixed") => {
    return type === "percentage" ? `${discount}%` : `$${discount}`;
  };

  return (
    <div className="px-4 mb-6">
      <div className="flex items-center mb-4">
        <h2 className="text-dark font-roboto font-medium">
          {t("enterCouponCode") || "Enter Coupon Code"}
        </h2>
        <CustomTooltip
          content={
            <div className="p-1">
              {t("tooltipText") ||
                "Enter a valid coupon code to apply discounts to your order. Coupon codes are case-insensitive and will be automatically validated."}
            </div>
          }
          position="top"
          delay={300}
        >
          <QuestionIcon className="ml-2" />
        </CustomTooltip>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Tag size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={
              t("couponPlaceholder") || "Enter coupon code (e.g., SAVE10)"
            }
            value={couponInput}
            onChange={(e) => {
              const upperValue = e.target.value.toUpperCase();
              setCouponInput(upperValue);
              setCouponInfo(null);
              setValidationError("");
              setValidationErrorCode(null);
              setShouldValidate(false);
            }}
            onBlur={handleValidateCoupon}
            className={`w-full p-3 pl-12 border ${
              validationError
                ? "border-red-500"
                : couponInfo
                ? "border-green-500"
                : "border-gray-200"
            } rounded-lg uppercase tracking-wider font-mono`}
          />
          {isValidating && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 size={18} className="animate-spin text-blue-500" />
            </div>
          )}
          {couponInfo && !isValidating && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Check size={18} className="text-green-500" />
            </div>
          )}
          {validationError && !isValidating && (
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowErrorAlert(true)}
            >
              <AlertCircle size={18} className="text-red-500" />
            </div>
          )}
        </div>

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="coupon-terms"
            checked={agreeToTerms}
            onChange={(e) => handleCheckboxValidation(e.target.checked)}
            className="mr-2 h-4 w-4 accent-blue-500"
          />
          <label htmlFor="coupon-terms" className="text-[11px] text-gray-600">
            {t("confirmCouponTerms") ||
              "I agree to the coupon terms and conditions"}
          </label>
        </div>

        <div className="mt-4 mb-2">
          <h3 className="text-[16px] font-bold font-condensed mb-2">
            {t("howToUseCoupons.title") || "How to Use Coupon Codes"}
          </h3>
          <ol className="text-[15px] font-condensed text-gray-600 space-y-1 list-decimal pl-5">
            <li className="text-black text-[17px]">
              {t("howToUseCoupons.step1") ||
                "Enter your coupon code in the field above"}
            </li>
            <li className="text-black font-condensed text-[17px]">
              {t("howToUseCoupons.step2") ||
                "The system will automatically validate the code"}
            </li>
            <li className="text-black font-condensed text-[17px]">
              {t("howToUseCoupons.step3") ||
                "Discount will be applied to your order total"}
            </li>
            <li className="text-black font-condensed text-[17px]">
              {t("howToUseCoupons.step4") ||
                "Complete your purchase to use the discount"}
            </li>
          </ol>
        </div>
      </div>

      <CustomAlert
        isOpen={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
        message={getFormattedErrorMessage()}
      />
    </div>
  );
}
