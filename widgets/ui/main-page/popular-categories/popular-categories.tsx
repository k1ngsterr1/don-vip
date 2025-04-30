import Link from "next/link";

export function PopularCategories() {
  const categories = [
    { name: "Игры", href: "/games" },
    { name: "Сервисы", href: "/services" },
    { name: "Купоны", href: "/coupons" },
    { name: "Новинки", href: "/new" },
  ];

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-max">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.href}
            className="px-4 py-2 bg-gray-100 text-dark text-xs rounded-full whitespace-nowrap hover:bg-gray-200 transition-colors"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
