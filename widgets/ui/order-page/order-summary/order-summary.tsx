"use client";

import { cn } from "@/shared/utils/cn";
import { Check, ShieldCheck, Percent } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CurrencyIcon } from "@/shared/ui/currency-icon";
import { useCurrency } from "@/entities/currency/hooks/use-currency";

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
  packageDiscount?: number; // Скидка от пакета в процентах
  telegramDiscount?: number; // Скидка Telegram (5%) в рублях
  referralDiscount?: number; // Реферальная скидка в рублях
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
  packageDiscount = 0,
  telegramDiscount = 0,
  referralDiscount = 0,
  isFormValid,
  userId,
  serverId,
  onSubmit,
  isLoading = false,
}: OrderSummaryProps) {
  const t = useTranslations("orderSummary");
  const { selectedCurrency: currentCurrency } = useCurrency();

  const isEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  // Calculate prices with all discounts
  const basePrice = selectedCurrency?.originalPriceRub || 0;

  // 1. Apply package discount first
  let priceAfterPackageDiscount = basePrice;
  if (packageDiscount > 0) {
    priceAfterPackageDiscount = basePrice * (1 - packageDiscount / 100);
  }

  // 2. Apply Telegram discount (already calculated in RUB)
  let priceAfterTelegramDiscount = priceAfterPackageDiscount - telegramDiscount;

  // 3. Apply Referral discount (already calculated in RUB)
  let priceAfterReferralDiscount =
    priceAfterTelegramDiscount - referralDiscount;

  // 4. Apply coupon discount
  const couponDiscountAmount =
    couponInfo?.type === "percentage"
      ? (priceAfterReferralDiscount * appliedDiscount) / 100
      : appliedDiscount;

  const finalPriceRub = Math.max(
    0,
    priceAfterReferralDiscount - couponDiscountAmount
  );

  // Convert to selected currency
  const basePriceConverted =
    currentCurrency.code === "RUB"
      ? basePrice
      : basePrice * currentCurrency.rate;

  const priceAfterPackageDiscountConverted =
    currentCurrency.code === "RUB"
      ? priceAfterPackageDiscount
      : priceAfterPackageDiscount * currentCurrency.rate;

  const telegramDiscountConverted =
    currentCurrency.code === "RUB"
      ? telegramDiscount
      : telegramDiscount * currentCurrency.rate;

  const referralDiscountConverted =
    currentCurrency.code === "RUB"
      ? referralDiscount
      : referralDiscount * currentCurrency.rate;

  const couponDiscountConverted =
    currentCurrency.code === "RUB"
      ? couponDiscountAmount
      : couponDiscountAmount * currentCurrency.rate;

  const finalPriceConverted =
    currentCurrency.code === "RUB"
      ? finalPriceRub
      : finalPriceRub * currentCurrency.rate;

  const hasPackageDiscount = packageDiscount > 0;
  const hasTelegramDiscount = telegramDiscount > 0;
  const hasReferralDiscount = referralDiscount > 0;
  const hasCouponDiscount = appliedDiscount > 0 && couponInfo;
  const hasAnyDiscount =
    hasPackageDiscount ||
    hasTelegramDiscount ||
    hasReferralDiscount ||
    hasCouponDiscount;

  // Calculate total savings
  const totalSavings = basePrice - finalPriceRub;
  const totalSavingsConverted = basePriceConverted - finalPriceConverted;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 sticky top-8">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          {t("summary.title")}
        </h2>

        <div className="flex items-center mb-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-lg overflow-hidden mr-4 bg-gray-100 flex-shrink-0">
            {game.currencyImage && (
              <CurrencyIcon
                src={game.currencyImage || "/placeholder.svg"}
                alt={game.currencyName}
                width={64}
                height={64}
                className="object-cover w-[54px] h-[54px]"
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
                    hasAnyDiscount && "line-through text-gray-500"
                  )}
                >
                  {basePriceConverted.toFixed(2)} {currentCurrency.code}
                </span>
              </div>

              {/* Package Discount */}
              {hasPackageDiscount && (
                <div className="flex justify-between text-orange-600">
                  <div className="flex items-center">
                    <Percent size={14} className="mr-1" />
                    <span className="text-sm">
                      {t("summary.packageDiscount") || "Package discount"}:
                    </span>
                  </div>
                  <span className="font-medium">-{packageDiscount}%</span>
                </div>
              )}

              {/* Telegram Discount */}
              {hasTelegramDiscount && (
                <div className="flex justify-between text-blue-600">
                  <div className="flex items-center">
                    <Percent size={14} className="mr-1" />
                    <span className="text-sm">
                      {t("summary.telegramDiscount") || "Telegram discount"}{" "}
                      (5%):
                    </span>
                  </div>
                  <span className="font-medium">
                    -{telegramDiscountConverted.toFixed(2)}{" "}
                    {currentCurrency.code}
                  </span>
                </div>
              )}

              {/* Referral Discount */}
              {hasReferralDiscount && (
                <div className="flex justify-between text-purple-600">
                  <div className="flex items-center">
                    <Percent size={14} className="mr-1" />
                    <span className="text-sm">
                      {t("summary.referralDiscount") || "Referral discount"}:
                    </span>
                  </div>
                  <span className="font-medium">
                    -{referralDiscountConverted.toFixed(2)}{" "}
                    {currentCurrency.code}
                  </span>
                </div>
              )}

              {/* Coupon Discount */}
              {hasCouponDiscount && couponInfo && (
                <div className="flex justify-between text-green-600">
                  <div className="flex items-center">
                    <Percent size={14} className="mr-1" />
                    <span className="text-sm">
                      {t("summary.discount") || "Discount"} ({couponInfo.code}):
                    </span>
                  </div>
                  <span className="font-medium">
                    -
                    {couponInfo.type === "percentage"
                      ? `${appliedDiscount}%`
                      : `${couponDiscountConverted.toFixed(2)} ${
                          currentCurrency.code
                        }`}
                  </span>
                </div>
              )}

              {/* Total after all discounts */}
              {hasAnyDiscount && (
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">
                      {t("summary.total") || "Total"}:
                    </span>
                    <span className="font-semibold text-lg text-green-600">
                      {finalPriceConverted.toFixed(2)} {currentCurrency.code}
                    </span>
                  </div>
                </div>
              )}

              {!hasAnyDiscount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("summary.cost")}:</span>
                  <span className="font-medium">{selectedCurrency.price}</span>
                </div>
              )}
            </div>

            {/* Savings highlight */}
            {hasAnyDiscount && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium text-green-700">
                    🎉 {t("summary.youSave") || "You save"}:{" "}
                    {totalSavingsConverted.toFixed(2)} {currentCurrency.code}
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
              {hasAnyDiscount && (
                <span className="ml-2 text-sm">
                  ({finalPriceConverted.toFixed(2)} {currentCurrency.code})
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
