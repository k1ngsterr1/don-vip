"use client";

import SearchBar from "@/entities/search-bar/search-bar";
import { faqItems } from "@/shared/data/faq-data";
import FAQItem from "@/shared/ui/faq-item/faq-item";
import Link from "next/link";
import { useState } from "react";

export default function MobileFAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItem, setOpenItem] = useState<number | null>(1); // Set the second item open by default

  const filteredFAQs = faqItems.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItem = (index: number) => {
    if (openItem === index) {
      setOpenItem(null);
    } else {
      setOpenItem(index);
    }
  };

  return (
    <div className="w-full px-[11px] mt-[24px] flex flex-col items-center md:hidden">
      <div className="w-full max-w-md mx-auto px-4 py-4 bg-white">
        <div className="w-full flex flex-col items-start justify-start">
          <Link
            href="/"
            className="text-blue font-roboto mt-[28px] text-[15px] text-left"
          >
            Вернуться
          </Link>
          <h1 className="font-unbounded mt-[24px] text-[14px] font-medium mb-[24px] text-dark">
            FAQ
          </h1>
        </div>
        <SearchBar
          height="48px"
          placeholder="Найти вопрос"
          onSearch={setSearchQuery}
        />
        <div className="space-y-3 mt-[24px]">
          {filteredFAQs.map((item: any, index: number) => (
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
              По вашему запросу ничего не найдено. Попробуйте изменить поисковый
              запрос.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
