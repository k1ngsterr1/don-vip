import Image from "next/image";
import React from "react";
import { PurchaseStatus } from "./purchase-status";

interface PurchaseCardProps {
  id: string;
  date: string;
  time: string;
  gameImage: string;
  currencyImage: string;
  status: "success" | "fail" | "pending";
}

export const PurchaseCard: React.FC<PurchaseCardProps> = ({
  id,
  date,
  time,
  gameImage,
  currencyImage,
  status,
}) => {
  return (
    <div className="w-full flex flex-col items-center bg-[#F3F4F7] rounded-[8px] px-4 py-3 gap-2">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-blue text-[13px]">Покупка #{id}</span>
          <span className="text-[11px] text-[#383838]">
            {date}, {time}
          </span>
        </div>
        <PurchaseStatus status={status} />
      </div>
      <div className="w-full flex items-center gap-4">
        <Image
          src={gameImage}
          alt="Game"
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div className="relative w-[48px] h-[48px]">
          <div className="relative w-[48px] h-[48px]">
            <Image
              src={currencyImage}
              alt="Currency"
              fill
              className="rounded-full object-contain"
            />
            <PurchaseStatus status={status} isAbsolute />
          </div>
        </div>
      </div>
    </div>
  );
};
