"use client";

import { useLocale } from "next-intl";

interface DesignServiceCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
}

export function DesignServiceCard({
  id,
  title,
  description,
  price,
}: DesignServiceCardProps) {
  const locale = useLocale();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-3 flex-grow line-clamp-2">
          {description}
        </p>

        {/* Price */}
        <div className="text-lg font-bold text-gray-900 mb-3">{price}</div>

        {/* Order Button */}
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
          {locale === "ru" ? "Заказать" : "Order"}
        </button>
      </div>
    </div>
  );
}
