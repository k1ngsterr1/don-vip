"use client";
import { useTranslations } from "next-intl";

interface FAQCategoriesProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function FAQCategories({
  activeCategory,
  setActiveCategory,
}: FAQCategoriesProps) {
  const t = useTranslations("FAQCategories");

  const categories = [
    { id: "all", name: t("all") },
    { id: "payment", name: t("payment") },
    { id: "delivery", name: t("delivery") },
    { id: "account", name: t("account") },
    { id: "products", name: t("products") },
    { id: "support", name: t("support") },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === category.id
              ? "bg-blue text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
