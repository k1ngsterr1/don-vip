"use client";

import { faqItems } from "@/shared/data/faq-data";
import FAQItem from "@/shared/ui/faq-item/faq-item";
import { ArrowLeft, HelpCircle, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import FAQCategories from "../faq-categories/faq-categories";

export default function DesktopFAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItem, setOpenItem] = useState<number | null>(1);
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFAQs = faqItems.filter((item) => {
    const matchesSearch = item.question
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || (item as any).category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    if (openItem === index) {
      setOpenItem(null);
    } else {
      setOpenItem(index);
    }
  };

  return (
    <div className="hidden md:block max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8 lg:mb-12">
        <div className="flex items-center mb-4">
          <Link
            href={"/"}
            className="text-blue hover:text-blue-700 transition-colors flex items-center group"
          >
            <ArrowLeft
              size={16}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-base">Вернуться</span>
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-unbounded font-medium text-gray-800">
              Часто задаваемые вопросы
            </h1>
            <p className="text-gray-500 mt-2 max-w-2xl">
              Найдите ответы на самые распространенные вопросы о наших услугах и
              продуктах
            </p>
          </div>
          <div className="hidden lg:flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full">
            <HelpCircle className="text-blue w-8 h-8" />
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        <div className="lg:w-2/3">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Поиск по вопросам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
        <div className="lg:w-1/3">
          <FAQCategories
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openItem === index}
                index={index}
                onToggle={toggleItem}
                enhanced={true}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              По вашему запросу ничего не найдено
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Попробуйте изменить поисковый запрос или выбрать другую категорию
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-4 px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
      <div className="mt-12 bg-blue-50 rounded-xl p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="mb-6 lg:mb-0">
            <h2 className="text-2xl font-medium text-gray-800 mb-2">
              Не нашли ответ на свой вопрос?
            </h2>
            <p className="text-gray-600">
              Свяжитесь с нашей службой поддержки, и мы поможем вам
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:hoyakap@gmail.com"
              className="px-6 py-3 bg-white text-blue border border-blue rounded-lg hover:bg-blue-50 transition-colors text-center"
            >
              Написать на Email
            </a>
            <a
              href="https://t.me/Davo_dior55"
              className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
            >
              Написать в Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
