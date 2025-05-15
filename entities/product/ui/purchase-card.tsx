"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { PurchaseStatus } from "./purchase-status";
import { useTranslations } from "next-intl";

export interface PurchaseCardProps {
  id: string;
  date: string;
  time: string;
  gameImage: string;
  currencyImage: string;
  status: "success" | "fail" | "pending";
  playerId: string;
  serverId: string;
  diamonds: number;
  price: string;
}

export const PurchaseCard: React.FC<PurchaseCardProps> = ({
  id,
  date,
  time,
  gameImage,
  currencyImage,
  status,
  playerId,
  serverId,
  diamonds,
  price,
}) => {
  const t = useTranslations("profilePurchases");
  const [isExpanded, setIsExpanded] = useState(false);

  const steps = [
    { key: "purchaseCompleted", description: "purchaseCompletedDesc" },
    { key: "paid", description: "paidDesc" },
    { key: "inDelivery", description: "inDeliveryDesc" },
    { key: "successfulDelivery", description: "successfulDeliveryDesc" },
    { key: "orderClosed", description: "orderClosedDesc" },
  ];

  return (
    <div
      className={`w-full flex flex-col items-center bg-[#F3F4F7] rounded-[8px] px-4 py-3 gap-2 cursor-pointer hover:bg-[#E9EBF0] transition-colors ${
        isExpanded ? "shadow-md" : ""
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 text-[13px]">
            {t("purchase")} #{id}
          </span>
          <span className="text-[11px] text-[#383838]">
            {date}, {time}
          </span>
        </div>
        <PurchaseStatus status={status} />
      </div>
      <div className="w-full flex items-center gap-4">
        <Image
          src={gameImage || "/placeholder.svg"}
          alt={t("gameImageAlt")}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div className="relative w-[48px] h-[48px]">
          <div className="relative w-[48px] h-[48px]">
            <Image
              src={currencyImage || "/placeholder.svg"}
              alt={t("currencyImageAlt")}
              fill
              className="rounded-full object-contain"
            />
            <PurchaseStatus status={status} isAbsolute />
          </div>
        </div>
      </div>
      {/* Expanded details */}
      {isExpanded && (
        <div className="w-full mt-3 pt-3 border-t border-gray-200">
          {/* Status Timeline */}
          <div className="relative pl-8 mb-6">
            {steps.map((step, index) => (
              <div key={index} className="mb-4 relative">
                {/* Vertical line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[-24px] top-[24px] w-[2px] h-[calc(100%-8px)] bg-green-500"></div>
                )}

                {/* Status circle */}
                <div className="absolute left-[-30px] top-0 w-[24px] h-[24px] rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>

                {/* Status text */}
                <div>
                  <h3 className="text-sm font-medium">{t(step.key)}</h3>
                  <p className="text-xs text-[#383838]">
                    {t(step.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Purchase Details */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#E9EBF0] p-3 rounded-md">
              <div className="text-xs text-[#383838] mb-1">{t("playerId")}</div>
              <div className="text-sm font-medium">{playerId}</div>
            </div>
            <div className="bg-[#E9EBF0] p-3 rounded-md">
              <div className="text-xs text-[#383838] mb-1">{t("serverId")}</div>
              <div className="text-sm font-medium">{serverId}</div>
            </div>
            <div className="bg-[#E9EBF0] p-3 rounded-md">
              <div className="text-xs text-[#383838] mb-1">{t("diamonds")}</div>
              <div className="text-sm font-medium flex items-center">
                <Image
                  src="/diamond.png"
                  alt="Diamond"
                  width={16}
                  height={16}
                  className="mr-1"
                />
                {diamonds}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex justify-end">
            <div className="text-xl font-bold">{price}</div>
          </div>
        </div>
      )}
    </div>
  );
};
