"use client";
import { AlertCircle, Check, Tag } from "lucide-react";
import { useTranslations } from "next-intl";

interface PromocodeInputProps {
  promocode: string;
  setPromocode: (value: string) => void;
  appliedPromocode: { code: string; discount: number } | null;
  promocodeError: string;
  onApply: () => void;
  onRemove: () => void;
}

export function PromocodeInput({
  promocode,
  setPromocode,
  appliedPromocode,
  promocodeError,
  onApply,
  onRemove,
}: PromocodeInputProps) {
  const t = useTranslations("Payment.payment.form.promocode");

  return (
    <div className="space-y-2">
      <label
        htmlFor="promocode"
        className="text-sm font-medium flex items-center gap-2 text-gray-700"
      >
        <Tag className="h-4 w-4 text-[#6798de]" />
        {t("label")}
      </label>
      <div className="flex gap-2">
        <input
          id="promocode"
          type="text"
          value={promocode}
          onChange={(e) => setPromocode(e.target.value)}
          disabled={!!appliedPromocode}
          placeholder={t("placeholder")}
          className={`flex-1 px-3 py-2 border rounded-md ${
            promocodeError ? "border-red-500" : "border-gray-300"
          } ${appliedPromocode ? "bg-gray-100" : "bg-white"}`}
        />
        {appliedPromocode ? (
          <button
            type="button"
            onClick={onRemove}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            {t("cancel")}
          </button>
        ) : (
          <button
            type="button"
            onClick={onApply}
            disabled={!promocode.trim()}
            className="px-3 py-2 bg-[#6798de] text-white rounded-md hover:bg-[#5687cd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("apply")}
          </button>
        )}
      </div>

      {promocodeError && (
        <div className="flex items-center text-red-500 text-sm mt-1">
          <AlertCircle className="h-4 w-4 mr-1" />
          {promocodeError}
        </div>
      )}

      {appliedPromocode && (
        <div className="flex items-center text-green-600 text-sm mt-1">
          <Check className="h-4 w-4 mr-1" />
          {t.rich("applied", { discount: appliedPromocode.discount })}
        </div>
      )}
    </div>
  );
}
