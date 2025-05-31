"use client";

import { Check, Clock, X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";

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
}) => {
  const t = useTranslations("purchases");
  const [isExpanded, setIsExpanded] = useState(false);

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
              {t("purchase")} #{id}
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
              alt={t("gameImageAlt")}
              width={48}
              height={48}
              className="rounded-full w-12 h-12 object-cover"
            />
          </div>
          <div className="relative">
            <Image
              src={currencyImage || "/placeholder.svg"}
              alt={t("currencyImageAlt")}
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
                      {t(step.key)}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      {t(step.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Purchase Details */}
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg w-fit">
                <div className="text-xs text-gray-500 uppercase tracking-wide text-center">
                  {t("playerId")}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {playerId}
                </div>
              </div>

              {serverId && (
                <div className="bg-gray-50 p-3 rounded-lg w-fit">
                  <div className="text-xs text-gray-500 uppercase tracking-wide text-center">
                    {t("serverId")}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {serverId}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded-lg w-fit">
                <div className="text-xs text-gray-500 uppercase tracking-wide text-center">
                  {t("diamonds")}
                </div>
                <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <Image
                    src={currencyImage || "/placeholder.svg"}
                    alt={t("diamondIconAlt")}
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                  {diamonds}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{price}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
