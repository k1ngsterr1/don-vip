"use client";

import { Zap, Gift, Tag } from "lucide-react";

interface GameInfoBlockProps {
  gameName?: string;
}

export function GameInfoBlock({ gameName = "Bigo Live" }: GameInfoBlockProps) {
  return (
    <div className="px-4 py-6 bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-gray-800 text-lg font-semibold leading-tight">
          Донаты и пополнения для {gameName} — алмазы и другие ресурсы
        </h2>
      </div>

      {/* Instant Delivery Badge */}
      <div className="mb-6">
        <div className="bg-blue-500 text-white px-4 py-2 rounded-full inline-flex items-center gap-2">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Мгновенная доставка</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <p className="text-gray-700 text-base leading-relaxed">
          Завоевывай вершины и радуй своих любимых стримеров недорогими алмазами
          — пусть они ощущают твою поддержку и вдохновение!
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4">
        {/* Diamonds Feature */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Gift className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="text-gray-700 text-sm leading-relaxed">
              Алмазы — валюта в Bigo и ваш уникальный способ выразить себя или
              отблагодарить любимых стримеров и создателей контента. Тратьте их
              на подарки и реакции, поддерживая лучших творцов.
            </p>
          </div>
        </div>

        {/* Telegram Discount Feature */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Tag className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <div>
              <p className="text-gray-700 text-sm leading-relaxed mb-2">
                Войдите и получите купон на скидку 5% за подписку на наш
                Telegram канал
              </p>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
              Войти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
