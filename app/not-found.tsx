"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Translations
const translations = {
  en: {
    notFound: "Page Not Found",
    description: "The page you're looking for doesn't exist or has been moved.",
    returnHome: "Return Home",
  },
  ru: {
    notFound: "Страница не найдена",
    description:
      "Страница, которую вы ищете, не существует или была перемещена.",
    returnHome: "Вернуться на главную",
  },
};

export default function NotFound() {
  const pathname = usePathname();
  const localeFromUrl = pathname.split("/")[1]; // получаем "ru" или "en"
  const fallbackLocale = "en";
  const language =
    localeFromUrl in translations ? localeFromUrl : fallbackLocale;

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const t = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 xxs:px-1 relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <h1 className="text-9xl font-bold mb-2 xxs:text-7xl">404</h1>

        <div className="relative mb-8">
          <div className="h-4 mb-4"></div>
          <h2 className="text-2xl font-bold mb-2 xxs:text-xl">{t.notFound}</h2>
          <p className="text-gray-500 mb-6 xxs:text-xs">{t.description}</p>
        </div>

        <Link
          href={`/${language}`}
          className="px-6 py-3 xxs:px-4 xxs:py-2 xxs:text-xs rounded-full bg-blue-600 text-white font-medium transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t.returnHome}
        </Link>
      </div>
    </div>
  );
}
