"use client";
import { useTranslations } from "next-intl";
import SearchBar from "@/entities/search-bar/search-bar";
import FAQItem from "@/shared/ui/faq-item/faq-item";
import Link from "next/link";
import { useState } from "react";
import { getFAQData } from "@/shared/data/faq-data";

export default function MobileFAQ() {
  const i18n = useTranslations("MobileFAQ");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItem, setOpenItem] = useState<number | null>(1);

  // Use the translated FAQ data
  const t = useTranslations("faq");
  const faqItems = getFAQData(t);

  const filteredFAQs = faqItems.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="w-full px-[11px] mt-[24px] flex flex-col items-center md:hidden">
      <div className="w-full max-w-md mx-auto px-4 py-4 bg-white">
        <div className="w-full flex flex-col items-start justify-start">
          <Link
            href="/"
            className="text-blue font-roboto mt-[28px] text-[15px] text-left"
          >
            {i18n("backLink")}
          </Link>
          <h1 className="font-unbounded mt-[24px] text-[14px] font-medium mb-[24px] text-dark">
            {i18n("title")}
          </h1>
        </div>
        <SearchBar
          height="48px"
          placeholder={i18n("searchPlaceholder")}
          onSearch={setSearchQuery}
        />
        <div className="space-y-3 mt-[24px]">
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
