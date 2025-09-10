"use client";

import { Zap, Tag } from "lucide-react";

interface GameInfoBlockProps {
  gameName?: string;
}

export function GameInfoBlock({ gameName = "Bigo Live" }: GameInfoBlockProps) {
  return (
    <div className="px-4 py-6 bg-white">
      {/* Title */}
      <div className="mb-3">
        <h2 className="text-[#212529] text-[18px] font-medium leading-[20px]">
          Донаты и пополнения для {gameName} — алмазы и другие ресурсы
        </h2>
      </div>

      {/* Instant Delivery Badge */}
      <div className="mb-6">
        <div className="bg-[rgba(28,52,255,0.6)] text-white px-3 py-1.5 rounded-[4px] inline-flex items-center gap-2 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.32)]">
          <Zap className="w-3.5 h-3.5" />
          <span className="text-[10px] font-semibold">Мгновенная доставка</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-black text-[15px] font-light leading-[20px] capitalize">
          Завоевывай{" "}
          <span className="lowercase">
            вершины и радуй своих любимых стримеров недорогими алмазами — пусть
            они ощущают твою поддержку и вдохновение!
          </span>
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4">
        {/* Diamonds Feature */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-[34px] h-[27px] bg-[#eeeff3] rounded-[4px] flex items-center justify-center">
            <div className="w-5 h-[15px] bg-[url('/donvip-bigo.png')] bg-no-repeat bg-center bg-contain"></div>
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

        {/* Telegram Discount Feature */}
        <div className="bg-[#eeeff3] rounded-[12px] p-[15px] overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-[#1c34ff] rounded-[4px] flex items-center justify-center">
              <Tag className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[#212529] text-[14px] font-light leading-[18px]">
                <span className="uppercase">В</span>
                <span className="lowercase">
                  ойдите и получите купон на скидку 5% за подписку на наш
                </span>{" "}
                <span className="uppercase">t</span>
                <span className="lowercase">elegram канал</span>
              </p>
            </div>
            <button className="bg-[#1c34ff] text-white px-4 py-2 rounded-[24px] text-[16px] font-medium capitalize transition-colors hover:bg-[#1629d9]">
              войти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
