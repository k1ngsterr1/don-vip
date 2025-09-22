"use client";

import { useTranslations } from "next-intl";

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
}

export function ServiceCard({
  title,
  description,
  price,
  features,
}: ServiceCardProps) {
  const t = useTranslations("DesignServices");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 relative overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>

      <div className="mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4">
          <svg
            width="24"
            height="24"
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
        <h3
          className="text-xl font-semibold text-gray-900 mb-2"
          style={{ fontFamily: "var(--font-roboto)" }}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>

      <div
        className="text-3xl font-bold text-gray-900 mb-6"
        style={{ fontFamily: "var(--font-unbounded)" }}
      >
        {price}
      </div>

      <div className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-sm text-gray-700"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-green-500 flex-shrink-0"
            >
              <path
                d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
                fill="currentColor"
              />
            </svg>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <button
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        style={{ fontFamily: "var(--font-roboto)" }}
      >
        {t("orderButton")}
      </button>
    </div>
  );
}
