"use client";

import { Check, Clock, X, RotateCcw } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { CurrencyIcon } from "@/shared/ui/currency-icon";
import { useRepeatOrder } from "@/entities/order/hooks/use-repeat-order";
import { useAuthStore } from "@/entities/auth/store/auth.store";

export interface PurchaseCardProps {
  id: number | string;
  date: string;
  time?: string;
  gameImage: string;
  currencyImage: string;
  status: "Paid" | "Pending" | "Cancelled";
  playerId: string;
  serverId?: string | null;
  diamonds: number;
  price: string;
  gameId?: number | string; // Add gameId for navigation to product page
  gameName?: string; // Add gameName as fallback identifier
}

export const PurchaseCard: React.FC<PurchaseCardProps> = ({
  id,
  date,
  gameImage,
  currencyImage,
  status,
  playerId,
  serverId,
  diamonds,
  price,
  gameId,
  gameName,
}) => {
  const locale = useLocale();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: repeatOrder, isPending: isRepeating } = useRepeatOrder();
  const { user, isAuthenticated } = useAuthStore();

  // Translation helper function
  const getText = (key: string) => {
    const translations: Record<string, { ru: string; en: string }> = {
      purchase: { ru: "Покупка", en: "Purchase" },
      gameImageAlt: { ru: "Изображение игры", en: "Game Image" },
      currencyImageAlt: { ru: "Изображение валюты", en: "Currency Image" },
      diamondIconAlt: { ru: "Иконка алмаза", en: "Diamond Icon" },
      playerId: { ru: "ID игрока", en: "Player ID" },
      serverId: { ru: "ID сервера", en: "Server ID" },
      diamonds: { ru: "Алмазы", en: "Diamonds" },
      repeatOrder: { ru: "Повторить заказ", en: "Repeat Order" },
      repeating: { ru: "Повторение...", en: "Repeating..." },
      purchaseCompleted: { ru: "Покупка завершена", en: "Purchase Completed" },
      purchaseCompletedDesc: {
        ru: "Ваша покупка была успешно обработана",
        en: "Your purchase has been successfully processed",
      },
      inDelivery: { ru: "В доставке", en: "In Delivery" },
      inDeliveryDesc: {
        ru: "Ваш заказ находится в процессе доставки",
        en: "Your order is being delivered",
      },
      successfulDelivery: {
        ru: "Успешная доставка",
        en: "Successful Delivery",
      },
      successfulDeliveryDesc: {
        ru: "Ваш заказ был успешно доставлен",
        en: "Your order has been successfully delivered",
      },
      orderClosed: { ru: "Заказ закрыт", en: "Order Closed" },
      orderClosedDesc: {
        ru: "Ваш заказ был успешно завершен",
        en: "Your order has been successfully completed",
      },
      inPending: { ru: "В ожидании", en: "Pending" },
      inPendingDesc: {
        ru: "Ваш заказ ожидает обработки",
        en: "Your order is pending processing",
      },
      paymentCancelled: { ru: "Платеж отменен", en: "Payment Cancelled" },
      paymentCancelledDesc: {
        ru: "Ваш платеж был отменен",
        en: "Your payment has been cancelled",
      },
    };
    return (
      translations[key]?.[locale as "ru" | "en"] || translations[key]?.en || key
    );
  };

  // Функция для форматирования цены - заменяем ? на ₽
  const formatPrice = (priceString: string) => {
    return priceString.replace(/\?/g, "₽");
  };

  const handleRepeatOrder = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card expansion

    // Navigate directly to order page with gameId
    if (gameId) {
      // Add query parameters to prefill the order form
      const params = new URLSearchParams({
        userId: playerId,
        ...(serverId && { serverId: serverId }),
        amount: diamonds.toString(),
      });
      router.push(`/${locale}/product/${gameId}?${params.toString()}`);
    } else if (gameName) {
      // Use gameName as fallback identifier
      const params = new URLSearchParams({
        userId: playerId,
        ...(serverId && { serverId: serverId }),
        amount: diamonds.toString(),
      });
      router.push(
        `/${locale}/product/${gameName
          .toLowerCase()
          .replace(/\s+/g, "-")}?${params.toString()}`
      );
    } else {
      // Fallback to the original repeat order logic if no product identifier available
      console.warn(
        "No gameId or gameName provided for repeat order, falling back to original logic"
      );
      repeatOrder(id);
    }
  };

  const getStatusIcon = (stepStatus: "completed" | "pending" | "cancelled") => {
    switch (stepStatus) {
      case "completed":
        return <Check size={14} className="text-white" />;
      case "pending":
        return <Clock size={14} className="text-white" />;
      case "cancelled":
        return <X size={14} className="text-white" />;
    }
  };

  const getStatusColor = (
    stepStatus: "completed" | "pending" | "cancelled"
  ) => {
    switch (stepStatus) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
    }
  };

  const getStepsForStatus = () => {
    const baseSteps = [
      {
        key: "purchaseCompleted",
        description: "purchaseCompletedDesc",
        status: "completed" as const,
      },
    ];

    if (status === "Paid") {
      return [
        ...baseSteps,
        {
          key: "inDelivery",
          description: "inDeliveryDesc",
          status: "completed" as const,
        },
        {
          key: "successfulDelivery",
          description: "successfulDeliveryDesc",
          status: "completed" as const,
        },
        {
          key: "orderClosed",
          description: "orderClosedDesc",
          status: "completed" as const,
        },
      ];
    }
    if (status === "Pending") {
      return [
        ...baseSteps,
        {
          key: "inPending",
          description: "inPendingDesc",
          status: "pending" as const,
        },
      ];
    }
    if (status === "Cancelled") {
      return [
        ...baseSteps,
        {
          key: "paymentCancelled",
          description: "paymentCancelledDesc",
          status: "cancelled" as const,
        },
      ];
    }

    return baseSteps;
  };

  const steps = getStepsForStatus();

  const getHeaderStatusIcon = () => {
    switch (status) {
      case "Paid":
        return (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
        );
      case "Pending":
        return (
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
            <Clock size={14} className="text-white" />
          </div>
        );
      case "Cancelled":
        return (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <X size={14} className="text-white" />
          </div>
        );
    }
  };

  return (
    <div
      className={`w-full bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 ${
        isExpanded ? "shadow-lg" : "shadow-sm"
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-blue-600 font-medium text-sm">
              {getText("purchase")} #{id}
            </span>
            <span className="text-gray-500 text-sm">{date}</span>
          </div>
          {getHeaderStatusIcon()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Game and Currency Images */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <Image
              src={gameImage || "/placeholder.svg"}
              alt={getText("gameImageAlt")}
              width={48}
              height={48}
              className="rounded-full w-12 h-12 object-cover"
            />
          </div>
          <div className="relative">
            <CurrencyIcon
              src={currencyImage || "/placeholder.svg"}
              alt={getText("currencyImageAlt")}
              width={48}
              height={48}
              className="rounded-full w-12 h-12 object-contain"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${getStatusColor(
                status === "Paid"
                  ? "completed"
                  : status === "Pending"
                  ? "pending"
                  : "cancelled"
              )}`}
            >
              {getStatusIcon(
                status === "Paid"
                  ? "completed"
                  : status === "Pending"
                  ? "pending"
                  : "cancelled"
              )}
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div>
            {/* Status Timeline */}
            <div className="relative mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 relative">
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-3 top-6 w-0.5 h-[calc(100%-6px)] ${getStatusColor(
                        step.status
                      )}`}
                    ></div>
                  )}

                  {/* Status Circle */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(
                      step.status
                    )}`}
                  >
                    {getStatusIcon(step.status)}
                  </div>

                  {/* Status Content */}
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {getText(step.key)}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      {getText(step.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Purchase Details */}
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg w-fit">
                <div className="text-xs text-gray-500 uppercase tracking-wide text-center">
                  {getText("playerId")}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {playerId}
                </div>
              </div>

              {serverId && (
                <div className="bg-gray-50 p-3 rounded-lg w-fit">
                  <div className="text-xs text-gray-500 uppercase tracking-wide text-center">
                    {getText("serverId")}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {serverId}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded-lg w-fit">
                <div className="text-xs text-gray-500 uppercase tracking-wide text-center">
                  {getText("diamonds")}
                </div>
                <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <CurrencyIcon
                    src={currencyImage || "/placeholder.svg"}
                    alt={getText("diamondIconAlt")}
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                  {diamonds}
                </div>
              </div>
            </div>

            {/* Price and Repeat Order Button */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(price)}
              </div>
              {isAuthenticated && (
                <button
                  onClick={handleRepeatOrder}
                  disabled={isRepeating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <RotateCcw
                    size={16}
                    className={isRepeating ? "animate-spin" : ""}
                  />
                  {isRepeating ? getText("repeating") : getText("repeatOrder")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
