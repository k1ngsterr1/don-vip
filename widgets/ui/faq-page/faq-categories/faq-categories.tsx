"use client";

interface FAQCategoriesProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function FAQCategories({
  activeCategory,
  setActiveCategory,
}: FAQCategoriesProps) {
  const categories = [
    { id: "all", name: "Все вопросы" },
    { id: "payment", name: "Оплата" },
    { id: "delivery", name: "Доставка" },
    { id: "account", name: "Аккаунт" },
    { id: "products", name: "Товары" },
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
