"use client";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PurchaseCard } from "@/entities/product/ui/purchase-card";

export default function PurchaseProfileBlock() {
  // Mock data from the provided JSON
  const purchaseData = {
    total: 1,
    page: 1,
    limit: 10,
    data: [
      {
        id: 0,
        date: "5/21/2025",
        time: "9:19:33 AM",
        gameImage:
          "https://don-vip.online/uploads/products/product-1747750950048-578759147.jpeg",
        currencyImage:
          "https://don-vip.online/uploads/products/product-1747750950049-700359477.jpeg",
        status: "success",
        playerId: "Arm000777",
        serverId: "N/A",
        diamonds: 50,
        price: "10000₽",
      },
    ],
  };

  const hasPurchases = purchaseData.data.length > 0;

  return (
    <div className="w-full mx-auto mt-8 px-4 max-w-6xl">
      <div className="mb-6 w-full">
        <div className="w-full flex items-center justify-between mb-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 transition-colors flex items-center group"
          >
            <ArrowLeft
              size={18}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-base md:text-lg">Return</span>
          </Link>
        </div>
      </div>

      {hasPurchases ? (
        <div className="w-full mt-4 space-y-4">
          {purchaseData.data.map((purchase) => (
            <PurchaseCard key={purchase.id} {...(purchase as any)} />
          ))}
        </div>
      ) : (
        <div className="w-full mt-4 border-[#8B8B8B]/10 border-[1px] py-8 px-4 bg-[#F3F4F7] rounded-[12px] flex flex-col items-center justify-center">
          <Image
            src="/sad-diamond-icon.png"
            alt="Sad Diamond"
            className="w-[72px] h-[68px] mb-3"
            width={72}
            height={68}
          />
          <span className="text-[15px] md:text-base font-medium text-black">
            No purchases yet
          </span>
        </div>
      )}
    </div>
  );
}
