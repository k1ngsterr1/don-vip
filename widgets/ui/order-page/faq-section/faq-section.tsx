"use client";

import { useState } from "react";
import { cn } from "@/shared/utils/cn";
import { Plus, X } from "lucide-react";
import { useLocale } from "next-intl";

interface FAQItem {
  id: string;
  question: string;
  question_en?: string;
  answer: string;
  answer_en?: string;
  isExpanded?: boolean;
}

interface FAQSectionProps {
  items?: FAQItem[];
}

// Function to get localized default FAQ items
const getDefaultFAQItems = (locale: string): FAQItem[] => {
  if (locale === "en") {
    return [
      {
        id: "1",
        question: "What are diamonds in Bigo Live?",
        answer:
          "Diamonds in Bigo Live are an in-game currency used to purchase gifts, special effects, and other premium features in the app.",
        isExpanded: false,
      },
      {
        id: "2",
        question: "How to buy diamonds for Bigo Live?",
        answer:
          "You can buy diamonds for BIGO LIVE without logging into your account. You will only need an ID from the app. Make sure you enter the ID correctly - this depends on the success of the order. After payment, diamonds will appear on your account within a few minutes.",
        isExpanded: false,
      },
      {
        id: "3",
        question: "How to receive/get Bigo Live diamonds?",
        answer:
          "After successful payment, diamonds are automatically credited to your account within 5-10 minutes. Check your balance in the Bigo Live app.",
        isExpanded: false,
      },
      {
        id: "4",
        question: "How to gift diamonds to another Bigo Live user?",
        answer:
          "You can use diamonds to buy gifts for other users directly in the Bigo Live app during streams or in chat.",
        isExpanded: false,
      },
      {
        id: "5",
        question: "How quickly will I receive Bigo Live diamonds?",
        answer:
          "Diamonds usually arrive to your account within 5-10 minutes after successful payment. In rare cases, this may take up to 30 minutes.",
        isExpanded: false,
      },
    ];
  }

  return [
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
        "Обычно алмазы поступают на аккаунт в течение 5-10 минут после успешной оплаты. В редких случаев это может занять до 30 минут.",
      isExpanded: false,
    },
  ];
};

export function FAQSection({ items }: FAQSectionProps) {
  const locale = useLocale();
  const defaultFAQItems = getDefaultFAQItems(locale);
  const faqItems = items || defaultFAQItems;

  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(faqItems.filter((item) => item.isExpanded).map((item) => item.id))
  );

  // Helper function to get localized text
  const getLocalizedText = (text: string, textEn?: string): string => {
    return locale === "en" && textEn ? textEn : text;
  };

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
          <span className="text-black text-xs font-light">
            {locale === "en" ? "FAQ" : "FAQ"}
          </span>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-2">
        {faqItems.map((item) => {
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
                  {getLocalizedText(item.question, item.question_en)}
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
                    {getLocalizedText(
                      item.answer ||
                        "Ответ на этот вопрос появится в ближайшее время.",
                      item.answer_en
                    )}
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
