"use client";

import { useState } from "react";
import { cn } from "@/shared/utils/cn";
import { Plus, X } from "lucide-react";
import { useLocale } from "next-intl";

interface FAQItem {
  id: string;
  question: string;
  question_en?: string | null;
  answer: string;
  answer_en?: string | null;
  isExpanded?: boolean;
}

interface FAQSectionProps {
  items?: FAQItem[];
}

export function FAQSection({ items }: FAQSectionProps) {
  const locale = useLocale();

  // Use only API data, no fallback to default items
  const faqItems = items || [];

  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(faqItems.filter((item) => item.isExpanded).map((item) => item.id))
  );

  // Helper function to get localized text
  const getLocalizedText = (text: string, textEn?: string | null): string => {
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
        {faqItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              {locale === "en"
                ? "FAQ not available yet"
                : "FAQ пока недоступны"}
            </p>
          </div>
        ) : (
          faqItems.map((item) => {
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
          })
        )}
      </div>
    </div>
  );
}
