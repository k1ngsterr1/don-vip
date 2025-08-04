"use client";

import Image from "next/image";
import { Zap } from "lucide-react";
import { useLocale } from "next-intl";

interface GameInfoBlockProps {
  gameName?: string;
  gameName_en?: string | null;
  title?: string | null;
  title_en?: string | null;
  description?: string;
  description_en?: string | null;
}

export function GameInfoBlock({
  gameName = "Bigo Live",
  gameName_en,
  title,
  title_en,
  description = "Алмазы — валюта в Bigo и ваш уникальный способ выразить себя или отблагодарить любимых стримеров и создателей контента. Тратьте их на подарки и реакции, поддерживая лучших творцов.",
  description_en,
}: GameInfoBlockProps) {
  const locale = useLocale();

  // Helper function to get localized text
  const getLocalizedText = (text: string, textEn?: string | null): string => {
    return locale === "en" && textEn ? textEn : text;
  };

  // Get localized game name
  const localizedGameName = getLocalizedText(gameName, gameName_en);

  // Get title fromgit
  const displayTitle = title ? getLocalizedText(title, title_en) : "";

  // Get localized description
  const localizedDescription = getLocalizedText(description, description_en);
  return (
    <div className="px-4 py-6 md:px-0 md:py-0">
      {/* Title */}
      {displayTitle && (
        <div className="mb-3">
          <h2 className="text-[#212529] text-[18px] font-bold leading-[20px]">
            {displayTitle}
          </h2>
        </div>
      )}

      {/* Instant Delivery Badge */}
      <div className="mb-6">
        <div className="bg-[rgba(28,52,255,0.6)] text-white px-3 py-1.5 rounded-[4px] inline-flex items-center gap-2 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.32)]">
          <Zap className="w-3.5 h-3.5" />
          <span className="text-[14px] font-bold">
            {locale === "en" ? "Instant Delivery" : "Мгновенная доставка"}
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        {/* Diamonds Feature */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-[34px] h-[27px] bg-[#eeeff3] rounded-[4px] flex items-center justify-center">
            <Image
              src="/diamond.webp"
              alt={locale === "en" ? "Diamond icon" : "Иконка алмаза"}
              width={20}
              height={15}
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <p className="text-[#4d4d4d] text-[11px] font-light leading-[15px]">
              {localizedDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
