"use client";

import { useState } from "react";
import { cn } from "@/shared/utils/cn";
import { Plus, X } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isExpanded?: boolean;
}

interface FAQSectionProps {
  items?: FAQItem[];
}

const defaultFAQItems: FAQItem[] = [
  {
    id: "1",
    question: "Что такое алмазы в Bigo Live?",
    answer:
      "Алмазы в Bigo Live - это внутриигровая валюта, которая используется для покупки подарков, особых эффектов и других премиум-функций в приложении.",
    isExpanded: false,
  },
  {
    id: "2",
    question: "Как купить алмазы для Bigo Live?",
    answer:
      "Купить алмазы для BIGO LIVE можно без входа в аккаунт. Для этого вам будет нужен только ID из приложения. Убедитесь, что вводите ID правильно — от этого зависит успешность заказа. После оплаты алмазы появятся на вашем аккаунте в течение нескольких минут.",
    isExpanded: false,
  },
  {
    id: "3",
    question: "Как забрать/получить алмазы Bigo Live?",
    answer:
      "После успешной оплаты алмазы автоматически зачисляются на ваш аккаунт в течение 5-10 минут. Проверьте баланс в приложении Bigo Live.",
    isExpanded: false,
  },
  {
    id: "4",
    question: "Как подарить алмазы другому пользователю Bigo Live?",
    answer:
      "Вы можете использовать алмазы для покупки подарков другим пользователям прямо в приложении Bigo Live во время стримов или в чате.",
    isExpanded: false,
  },
  {
    id: "5",
    question: "Как быстро я получу алмазы Bigo Live?",
    answer:
      "Обычно алмазы поступают на аккаунт в течение 5-10 минут после успешной оплаты. В редких случаях это может занять до 30 минут.",
    isExpanded: false,
  },
  {
    id: "6",
    question: "Сколько стоят алмазы Bigo Live?",
    answer:
      "Цены на алмазы Bigo Live варьируются в зависимости от количества. У нас представлены различные пакеты по выгодным ценам с возможными скидками.",
    isExpanded: false,
  },
  {
    id: "7",
    question: "Безопасно ли покупать алмазы Bigo Live?",
    answer:
      "Да, покупка алмазов через наш сервис полностью безопасна. Мы используем защищенные платежные системы и не требуем пароль от вашего аккаунта.",
    isExpanded: false,
  },
  {
    id: "8",
    question: "Могу ли я вернуть алмазы Bigo Live?",
    answer:
      "Возврат виртуальной валюты не предусмотрен согласно политике Bigo Live. Убедитесь в правильности введенного ID перед оплатой.",
    isExpanded: false,
  },
  {
    id: "9",
    question: "Какие способы оплаты доступны?",
    answer:
      "Мы принимаем различные способы оплаты: банковские карты, электронные кошельки, мобильные платежи и другие популярные методы.",
    isExpanded: false,
  },
  {
    id: "10",
    question: "Нужно ли указывать пароль от аккаунта?",
    answer:
      "Нет, мы никогда не запрашиваем пароль от вашего аккаунта. Для пополнения достаточно только вашего Bigo ID.",
    isExpanded: false,
  },
  {
    id: "11",
    question: "Работает ли сервис круглосуточно?",
    answer:
      "Да, наш сервис работает 24/7. Вы можете совершать покупки в любое удобное время, и алмазы будут зачислены автоматически.",
    isExpanded: false,
  },
  {
    id: "12",
    question: "Могу ли я вам доверять при покупке алмазов для BIGO LIVE?",
    answer:
      "Да, мы являемся официальным партнером Bigo Live с многолетним опытом работы. Тысячи довольных клиентов и высокие рейтинги подтверждают нашу надежность.",
    isExpanded: false,
  },
];

export function FAQSection({ items = defaultFAQItems }: FAQSectionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(items.filter((item) => item.isExpanded).map((item) => item.id))
  );

  const toggleItem = (id: string) => {
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
                "border border-blue-300 rounded-xl overflow-hidden transition-all duration-200",
                isExpanded ? "bg-white shadow-sm" : "bg-white/50"
              )}
            >
              {/* Question */}
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-blue-50 transition-colors duration-200"
              >
                <span className="text-gray-800 text-sm font-medium pr-4 leading-relaxed">
                  {item.question}
                </span>

                <div className="flex-shrink-0 transition-transform duration-200">
                  {isExpanded ? (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>

              {/* Answer */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="text-gray-600 text-sm leading-relaxed pt-3">
                    {item.answer ||
                      "Ответ на этот вопрос появится в ближайшее время."}
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
