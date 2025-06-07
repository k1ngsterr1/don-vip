"use client";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { PurchaseCard } from "@/entities/product/ui/purchase-card";
import { usePurchaseHistory } from "@/entities/product/hooks/queries/use-purchase-history";
import { PurchaseHistorySkeleton } from "../state/purchase-history-skeleton";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function PurchaseProfileBlock() {
  const { data, isLoading, isError } = usePurchaseHistory();
  const t = useTranslations("purchases");
  const router = useRouter();

  const hasPurchases = data?.data?.length > 0;

  return (
    <div className="w-full mx-auto mt-8 px-4 max-w-6xl min-h-[100vh]">
      <div className="mb-6 w-full">
        <div className="w-full flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 transition-colors flex items-center group"
          >
            <ArrowLeft
              size={18}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-base md:text-lg">{t("return")}</span>
          </button>
        </div>
      </div>
      {isLoading ? (
        <PurchaseHistorySkeleton />
      ) : isError ? (
        <p className="text-red-500 mt-4">Failed to load purchase history.</p>
      ) : hasPurchases ? (
        <div className="w-full mt-4 space-y-4">
          {data.data.map((purchase: any) => (
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
          <span className="text-[15px] md:text-base font-medium text-black">
            {t("noPurchases")}
          </span>
        </div>
      )}
    </div>
  );
}
