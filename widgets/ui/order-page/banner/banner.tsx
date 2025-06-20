import LightningIcon from "@/shared/icons/lightning-icon";
import { useTranslations } from "next-intl";
import { use } from "react";

interface BannerProps {
  backgroundImage: string;
  height: string;
}

export function Banner({ backgroundImage, height }: BannerProps) {
  const t = useTranslations("orderSummary.summary.benefits");

  console.log("Translations:", {
    instantDelivery: t("benefits.instantDelivery"),
  });

  const mobileBanner = (
    <div
      className="relative w-full md:hidden bg-cover bg-center"
      style={{
        height,
        backgroundImage: `url(${backgroundImage || "/placeholder.svg"})`,
      }}
    >
      <div className="absolute bottom-4 right-4 bg-blue/60 text-white text-xs py-1 px-2 rounded-[4px] font-unbounded gap-2 flex items-center">
        <LightningIcon />
        {t("instantDelivery")}
      </div>
    </div>
  );

  const desktopBanner = (
    <div
      className="hidden md:block relative w-full rounded-lg overflow-hidden shadow-md bg-cover bg-center"
      style={{
        height,
        backgroundImage: `url(${backgroundImage || "/placeholder.svg"})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-6 left-6">
        <div className="bg-blue/60 text-white text-xs py-1 px-2 rounded-[4px] font-unbounded gap-2 flex items-center w-fit">
          <LightningIcon />
          {t("instantDelivery")}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mobileBanner}
      {desktopBanner}
    </>
  );
}
