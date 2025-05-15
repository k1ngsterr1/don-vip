"use client";

import BoxIcon from "@/shared/icons/box-icon";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const ProfilePurchasesBlock = () => {
  const t = useTranslations("profilePurchases");

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
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
    </div>
  );
};
