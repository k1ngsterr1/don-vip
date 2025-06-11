"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { getFAQData } from "@/shared/data/faq-data";
import FAQItem from "@/shared/ui/faq-item/faq-item";
import { Search } from "lucide-react";

export default function MobileFAQ() {
  const i18n = useTranslations("MobileFAQ");
  const t = useTranslations("faq");
  const faqItems = getFAQData(t);

  const [searchQuery, setSearchQuery] = useState("");
  const [openItem, setOpenItem] = useState<number | null>(1);

  const filteredFAQs = faqItems.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col items-center md:hidden py-6 px-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
        {i18n("title")}
      </h1>
      <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder={i18n("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 h-12 bg-gray-100 border-transparent text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-3 mt-4">
          {filteredFAQs.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openItem === index}
              index={index}
              onToggle={toggleItem}
            />
          ))}
          {filteredFAQs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {i18n("noResults")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
