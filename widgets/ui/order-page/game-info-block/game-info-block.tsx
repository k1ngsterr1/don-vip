"use client";

import Image from "next/image";
import { Zap } from "lucide-react";

interface GameInfoBlockProps {
  gameName?: string;
}

export function GameInfoBlock({ gameName = "Bigo Live" }: GameInfoBlockProps) {
  return (
    <div className="px-4 py-6 md:px-0 md:py-0">
      {/* Title */}
      <div className="mb-3">
        <h2 className="text-[#212529] text-[18px] font-bold leading-[20px]">
          Донаты и пополнения для {gameName} — алмазы и другие ресурсы
        </h2>
      </div>

      {/* Instant Delivery Badge */}
      <div className="mb-6">
        <div className="bg-[rgba(28,52,255,0.6)] text-white px-3 py-1.5 rounded-[4px] inline-flex items-center gap-2 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.32)]">
          <Zap className="w-3.5 h-3.5" />
          <span className="text-[14px] font-bold">Мгновенная доставка</span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        {/* Diamonds Feature */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-[34px] h-[27px] bg-[#eeeff3] rounded-[4px] flex items-center justify-center">
            <Image
              src="/diamond.webp"
              alt="Diamond icon"
              width={20}
              height={15}
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <p className="text-[#4d4d4d] text-[11px] font-light leading-[15px] capitalize">
              Алмазы — <span className="lowercase">валюта в</span> Bigo{" "}
              <span className="lowercase">
                и ваш уникальный способ выразить себя или отблагодарить любимых
                стримеров и создателей контента
              </span>
              . Тр
              <span className="lowercase">
                атьте их на подарки и реакции, поддерживая лучших творцов.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
