"use client";

import { AlertCircle, Check, Tag, Lock } from "lucide-react";
import { useTranslations } from "next-intl";

interface PromocodeInputProps {
  promocode: string;
  setPromocode: (value: string) => void;
  appliedPromocode: { code: string; discount: number } | null;
  promocodeError: string;
  onApply: () => void;
  onRemove: () => void;
  isLoading?: boolean;
  isAvailable?: boolean; // New prop to control availability
}

export function PromocodeInput({
  promocode,
  setPromocode,
  appliedPromocode,
  promocodeError,
  onApply,
  onRemove,
  isLoading = false,
  isAvailable = false, // Default to available
}: PromocodeInputProps) {
  const t = useTranslations("Payment.payment.form.promocode");

  // Determine if the component should be disabled
  const isDisabled = !isAvailable || !!appliedPromocode || isLoading;

  return (
    <div className="space-y-2">
      <label
        htmlFor="promocode"
        className={`text-sm font-medium flex items-center gap-2 ${
          isAvailable ? "text-gray-700" : "text-gray-400"
        }`}
      >
        {isAvailable ? (
          <Tag className="h-4 w-4 text-[#6798de]" />
        ) : (
          <Lock className="h-4 w-4 text-gray-400" />
        )}
        {t("label")}
        {!isAvailable && (
          <span className="text-xs text-gray-400 ml-1">(Not Available)</span>
        )}
      </label>

      <div className={`flex gap-2 ${!isAvailable ? "opacity-60" : ""}`}>
        <input
          id="promocode"
          type="text"
          value={promocode}
          onChange={(e) =>
            isAvailable && setPromocode(e.target.value.toUpperCase())
          }
          disabled={isDisabled}
          placeholder={
            isAvailable ? t("placeholder") : "Promocodes not available"
          }
          className={`flex-1 px-3 py-2 border rounded-md transition-colors ${
            promocodeError && isAvailable ? "border-red-500" : "border-gray-300"
          } ${
            appliedPromocode
              ? "bg-gray-100"
              : !isAvailable
              ? "bg-gray-50 cursor-not-allowed"
              : "bg-white"
          } ${!isAvailable ? "text-gray-400" : ""}`}
        />

        {appliedPromocode ? (
          <button
            type="button"
            onClick={onRemove}
            disabled={!isAvailable}
            className={`px-3 py-2 rounded-md transition-colors ${
              isAvailable
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {t("cancel")}
          </button>
        ) : (
          <button
            type="button"
            onClick={onApply}
            disabled={!promocode.trim() || isLoading || !isAvailable}
            className={`px-3 py-2 rounded-md transition-colors min-w-[80px] ${
              isAvailable
                ? "bg-[#6798de] text-white hover:bg-[#5687cd] disabled:opacity-50 disabled:cursor-not-allowed"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              t("apply")
            )}
          </button>
        )}
      </div>

      {/* Show unavailable message when locked */}
      {!isAvailable && (
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <Lock className="h-4 w-4 mr-1" />
          Promocodes are currently not available for this order
        </div>
      )}

      {/* Show error only when available */}
      {promocodeError && isAvailable && (
        <div className="flex items-center text-red-500 text-sm mt-1">
          <AlertCircle className="h-4 w-4 mr-1" />
          {promocodeError}
        </div>
      )}

      {/* Show applied promocode only when available */}
      {appliedPromocode && isAvailable && (
        <div className="flex items-center text-green-600 text-sm mt-1">
          <Check className="h-4 w-4 mr-1" />
          {t.rich("applied", {
            code: appliedPromocode.code,
            discount: appliedPromocode.discount,
          })}
        </div>
      )}
    </div>
  );
}
