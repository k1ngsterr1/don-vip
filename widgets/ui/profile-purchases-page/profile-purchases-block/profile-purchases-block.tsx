"use client";

import BoxIcon from "@/shared/icons/box-icon";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { PurchaseCard } from "@/entities/product/ui/purchase-card";

// Mock purchase data
const mockPurchases = [
  {
    id: "2176672",
    date: "21.03.2025",
    time: "14:20",
    gameImage: "/game-icon.png",
    currencyImage: "/currency-icon.png",
    status: "success" as const,
    playerId: "739917879",
    serverId: "63465",
    diamonds: 50,
    price: "92.78 ₽",
  },
  {
    id: "2176543",
    date: "20.03.2025",
    time: "10:15",
    gameImage: "/game-icon.png",
    currencyImage: "/currency-icon.png",
    status: "success" as const,
    playerId: "739917879",
    serverId: "63465",
    diamonds: 100,
    price: "185.50 ₽",
  },
  {
    id: "2176421",
    date: "18.03.2025",
    time: "16:30",
    gameImage: "/game-icon.png",
    currencyImage: "/currency-icon.png",
    status: "pending" as const,
    playerId: "739917879",
    serverId: "63465",
    diamonds: 25,
    price: "46.25 ₽",
  },
];

export const ProfilePurchasesBlock = () => {
  const t = useTranslations("profilePurchases");

  // Check if purchases array is empty
  const hasPurchases = mockPurchases.length > 0;

  return (
    <div className="w-full mx-auto mt-8">
      <div className="mb-6 w-full">
        <div className="w-full flex items-center justify-between mb-4">
          <Link
            href={"/"}
            className="text-blue-600 hover:text-blue-700 transition-colors flex items-center group"
          >
            <ArrowLeft
              size={18}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-base md:text-lg">{t("return")}</span>
          </Link>
        </div>
      </div>
      <div className="w-full flex items-start justify-start gap-3">
        <div className="w-[24px] h-[24px] flex items-center justify-center rounded-[4px] bg-[#F03D00] font-condensed">
          <BoxIcon width={13} height={11} color="white" />
        </div>
        <h1 className="text-lg md:text-xl font-unbounded">{t("purchases")}</h1>
      </div>

      {hasPurchases ? (
        // Render purchase cards if there are purchases
        <div className="w-full mt-4 space-y-4">
          {mockPurchases.map((purchase) => (
            <PurchaseCard key={purchase.id} {...purchase} />
          ))}
        </div>
      ) : (
        // Render empty state if there are no purchases
        <div className="w-full mt-4 border-[#8B8B8B]/10 border-[1px] py-8 px-4 bg-[#F3F4F7] rounded-[12px] flex flex-col items-center justify-center">
          <Image
            src="/sad_diamond.webp"
            alt="Sad Diamond"
            className="w-[72px] h-[68px] mb-3"
            width={72}
            height={68}
          />
          <span className="text-[15px] md:text-base font-roboto text-black">
            {t("noPurchases")}
          </span>
        </div>
      )}
    </div>
  );
};
