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
    instantDelivery: t("instantDelivery"),
  });

  const mobileBanner = (
    <div
      className="relative w-full md:hidden bg-cover bg-center"
      style={{
        height,
        backgroundImage: `url(${backgroundImage || "/placeholder.svg"})`,
      }}
    ></div>
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
    </div>
  );

  return (
    <>
      {mobileBanner}
      {desktopBanner}
    </>
  );
}
