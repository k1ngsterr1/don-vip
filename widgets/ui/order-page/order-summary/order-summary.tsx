"use client";

import { cn } from "@/shared/utils/cn";
import { Check, ShieldCheck, Percent } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface OrderSummaryProps {
  game: any;
  selectedCurrency: any;
  appliedDiscount?: number;
  couponInfo?: {
    code: string;
    discount: number;
    type: "percentage" | "fixed";
    description: string;
  } | null;
  isFormValid: boolean;
  userId: string;
  serverId: string;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function OrderSummary({
  game,
  selectedCurrency,
  appliedDiscount = 0,
  couponInfo,
  isFormValid,
  userId,
  serverId,
  onSubmit,
  isLoading = false,
}: OrderSummaryProps) {
  const t = useTranslations("orderSummary");

  const isEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  // Calculate prices
  const originalPrice = selectedCurrency
    ? Number(selectedCurrency.price.replace(/[^0-9.]/g, ""))
    : 0;
  const discountAmount =
    couponInfo?.type === "percentage"
      ? (originalPrice * appliedDiscount) / 100
      : appliedDiscount;
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const hasDiscount = appliedDiscount > 0 && couponInfo;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 sticky top-8">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          {t("summary.title")}
        </h2>

        <div className="flex items-center mb-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-lg overflow-hidden mr-4 bg-gray-100 flex-shrink-0">
            {game.currencyImage && (
              <Image
                src={game.currencyImage || "/placeholder.svg"}
                alt={game.currencyName}
                width={64}
                height={64}
                className="object-cover w-[54px] h-[54px] "
              />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{game.name}</h3>
            <p className="text-sm text-gray-500">{game.currencyName}</p>
          </div>
        </div>

        {selectedCurrency && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">{t("summary.quantity")}:</span>
              <span className="font-medium">{selectedCurrency.amount}</span>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t("summary.subtotal") || "Subtotal"}:
                </span>
                <span
                  className={cn(
                    "font-medium",
                    hasDiscount && "line-through text-gray-500"
                  )}
                >
                  {originalPrice.toFixed(2)} RUB
                </span>
              </div>

              {hasDiscount && (
                <>
                  <div className="flex justify-between text-green-600">
                    <div className="flex items-center">
                      <Percent size={14} className="mr-1" />
                      <span className="text-sm">
                        {t("summary.discount") || "Discount"} ({couponInfo.code}
                        ):
                      </span>
                    </div>
                    <span className="font-medium">
                      -
                      {couponInfo.type === "percentage"
                        ? `${appliedDiscount}%`
                        : `${appliedDiscount.toFixed(2)} RUB`}
                    </span>
                  </div>

                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">
                        {t("summary.total") || "Total"}:
                      </span>
                      <span className="font-semibold text-lg text-green-600">
                        {finalPrice.toFixed(2)} RUB
                      </span>
                    </div>
                  </div>
                </>
              )}

              {!hasDiscount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("summary.cost")}:</span>
                  <span className="font-medium">{selectedCurrency.price}</span>
                </div>
              )}
            </div>

            {/* Savings highlight */}
            {hasDiscount && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium text-green-700">
                    🎉 {t("summary.youSave") || "You save"}:{" "}
                    {discountAmount.toFixed(2)} RUB
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {userId && !isEmail(userId) && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {t("summary.userInfo")}:
            </h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <span className="text-gray-600 text-sm">ID:</span>
                <span className="ml-2 font-medium text-sm">{userId}</span>
              </div>
              {serverId && (
                <div className="flex items-center mt-1">
                  <span className="text-gray-600 text-sm">
                    {t("summary.server")}:
                  </span>
                  <span className="ml-2 font-medium text-sm">{serverId}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <button
          className={cn(
            "w-full py-3 px-4 rounded-lg text-white font-medium transition-colors",
            isFormValid ? "bg-blue hover:bg-blue-600" : "bg-gray-400"
          )}
          disabled={!isFormValid || isLoading}
          onClick={onSubmit}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              {t("summary.redirecting")}{" "}
            </div>
          ) : (
            <span className="flex items-center justify-center">
              {t("summary.buyNow")}
              {hasDiscount && (
                <span className="ml-2 text-sm">
                  ({finalPrice.toFixed(2)} RUB)
                </span>
              )}
            </span>
          )}
        </button>

        <div className="mt-4 flex items-start">
          <ShieldCheck
            className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
            size={16}
          />
          <p className="text-xs text-gray-500">
            {t("summary.securityMessage")}
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <Check className="text-green-500 mr-2" size={14} />
            <span className="text-xs text-gray-600">
              {t("summary.benefits.instantDelivery")}
            </span>
          </div>
          <div className="flex items-center">
            <Check className="text-green-500 mr-2" size={14} />
            <span className="text-xs text-gray-600">
              {t("summary.benefits.support")}
            </span>
          </div>
          <div className="flex items-center">
            <Check className="text-green-500 mr-2" size={14} />
            <span className="text-xs text-gray-600">
              {t("summary.benefits.securePayment")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
