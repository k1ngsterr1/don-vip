"use client";

import { Link } from "@/i18n/navigation";
import { getFAQData } from "@/shared/data/faq-data";
import FAQItem from "@/shared/ui/faq-item/faq-item";
import { ArrowLeft, HelpCircle, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function DesktopFAQ() {
  const i18n = useTranslations("DesktopFAQ");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItem, setOpenItem] = useState<number | null>(null); // Changed: Default to null (all closed)
  const [activeCategory, setActiveCategory] = useState("all");

  const t = useTranslations("faq"); // For potential use in getFAQData if it were fully i18n'd
  const faqItems = getFAQData(t);

  const filteredFAQs = faqItems.filter((item) => {
    const matchesSearch = item.question
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="hidden md:block w-full mx-auto py-8 lg:py-12">
      <div className="mb-8 lg:mb-12">
        <div className="flex items-center mb-4">
          <Link
            href={"/"}
            className="text-blue-600 hover:text-blue-700 transition-colors flex items-center group"
          >
            <ArrowLeft
              size={16}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-base">{i18n("backLink")}</span>
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-semibold text-gray-800">
              {" "}
              {/* Replaced font-unbounded */}
              {i18n("title")}
            </h1>
            <p className="text-gray-500 mt-2 max-w-2xl">{i18n("subtitle")}</p>
          </div>
          <div className="hidden lg:flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full">
            <HelpCircle className="text-blue-600 w-8 h-8" />
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
              placeholder={i18n("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
        {filteredFAQs.length > 0 ? (
          <div className="space-y-1">
            {filteredFAQs.map((item, index) => (
              <FAQItem
                key={index} // Using index as key, ensure stable IDs if data changes frequently
                question={item.question}
                answer={item.answer ?? ("" as any)}
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
              {i18n("noResults.title")}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {i18n("noResults.description")}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setOpenItem(null); // Also reset open item on search clear
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {i18n("noResults.resetButton")}
            </button>
          </div>
        )}
      </div>
      <div className="mt-12 bg-blue-50 rounded-xl p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="mb-6 lg:mb-0 lg:max-w-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {" "}
              {/* Replaced font-unbounded */}
              {i18n("contact.title")}
            </h2>
            <p className="text-gray-600">{i18n("contact.description")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:hoyakap@gmail.com"
              className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-center"
            >
              {i18n("contact.emailButton")}
            </a>
            <a
              href="https://t.me/Davo_dior55"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              {i18n("contact.telegramButton")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
