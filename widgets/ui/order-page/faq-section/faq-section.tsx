"use client";

import { useState } from "react";
import { cn } from "@/shared/utils/cn";

interface FAQItem {
  id: number;
  question: string;
  answer?: string;
  isExpanded?: boolean;
}

interface FAQSectionProps {
  items?: FAQItem[];
}

const defaultFAQItems: FAQItem[] = [
  {
    id: 1,
    question: "🌟 Что такое алмазы в Bigo Live?",
    isExpanded: false,
  },
  {
    id: 2,
    question: "🛒 Как купить алмазы для Bigo Live?",
    answer:
      "Купить алмазы для BIGO LIVE можно без входа в аккаунт. Для этого вам будет нужен только ID из приложения. Убедитесь, что вводите ID правильно — от этого зависит успешность заказа. После оплаты алмазы появятся на вашем аккаунте в течение нескольких минут.",
    isExpanded: true,
  },
  {
    id: 3,
    question: "🖐 Как забрать/получить алмазы Bigo Live?",
    isExpanded: false,
  },
  {
    id: 4,
    question: "🎁 Как подарить алмазы другому пользователю Bigo Live?",
    isExpanded: false,
  },
  {
    id: 5,
    question: "🚀 Как быстро я получу алмазы Bigo Live?",
    isExpanded: false,
  },
  {
    id: 6,
    question: "💎 Что такое алмазы Bigo Live и для чего они нужны?",
    isExpanded: false,
  },
  {
    id: 7,
    question: "🧾 Как пополнить счет Bigo Live на вашем сайте?",
    isExpanded: false,
  },
  {
    id: 8,
    question: "📌 Где найти свой Bigo Live ID?",
    isExpanded: false,
  },
  {
    id: 9,
    question: "🚫 Могу ли я получить бан за покупку алмазов в BIGO LIVE?",
    isExpanded: false,
  },
  {
    id: 10,
    question: "💳 Какие способы оплаты доступны?",
    isExpanded: false,
  },
  {
    id: 11,
    question: "😔 Не пришли алмазы или пришло меньше, чем указано в заказе",
    isExpanded: false,
  },
  {
    id: 12,
    question: "🤔 Могу ли я вам доверять при покупке алмазов для BIGO LIVE?",
    isExpanded: false,
  },
];

export function FAQSection({ items = defaultFAQItems }: FAQSectionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(
    new Set(items.filter((item) => item.isExpanded).map((item) => item.id))
  );

  const toggleItem = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-4">
        <div className="bg-[#f3f4f7] px-3 py-2 rounded-lg inline-block">
          <span className="text-black text-xs font-light">FAQ</span>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-2">
        {items.map((item) => {
          const isExpanded = expandedItems.has(item.id);

          return (
            <div
              key={item.id}
              className={cn(
                "border border-blue-500 rounded-xl overflow-hidden transition-all",
                isExpanded ? "bg-white" : "bg-transparent"
              )}
            >
              {/* Question */}
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-black text-sm font-normal pr-2">
                  {item.question}
                </span>

                <div className="flex-shrink-0 w-3.5 h-6 flex items-center justify-center">
                  {isExpanded ? (
                    <div className="w-3.5 h-6 flex items-center justify-center">
                      <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">×</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-3.5 h-6 flex items-center justify-center">
                      <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">+</span>
                      </div>
                    </div>
                  )}
                </div>
              </button>

              {/* Answer */}
              {isExpanded && item.answer && (
                <div className="px-3 pb-3">
                  <div className="text-black text-sm font-light leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
