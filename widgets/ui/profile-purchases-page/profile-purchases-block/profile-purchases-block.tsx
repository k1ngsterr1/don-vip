"use client";

import BoxIcon from "@/shared/icons/box-icon";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { PurchaseCard } from "@/entities/product/ui/purchase-card";
import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/entities/order/api/order.api";
import { Link } from "@/i18n/navigation";

export const ProfilePurchasesBlock = () => {
  const t = useTranslations("profilePurchases");

  // ✅ Fetch order history
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", "history"],
    queryFn: () => orderApi.getOrderHistory(1, 10),
  });

  const purchases = data?.orders ?? [];

  const hasPurchases = purchases.length > 0;

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

      {isLoading ? (
        <p className="mt-6 text-gray-500">{t("loading") || "Loading..."}</p>
      ) : isError ? (
        <p className="mt-6 text-red-500">
          {t("error") || "Failed to load purchases"}
        </p>
      ) : hasPurchases ? (
        <div className="w-full mt-4 space-y-4">
          {purchases.map((purchase: any) => (
            <PurchaseCard key={purchase.id} {...purchase} />
          ))}
        </div>
      ) : (
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
