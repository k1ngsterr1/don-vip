"use client";

import Link from "next/link";

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
  locale: string;
}

export const Breadcrumb = ({ items, locale }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <Link
            href={`/${locale}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {locale === "ru" ? "Главная" : "Home"}
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <svg
              className="w-4 h-4 mx-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>

            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
