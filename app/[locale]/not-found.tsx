"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [language, setLanguage] = useState("en");

  // Follow cursor effect for the floating elements
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

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ru" : "en");
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 xxs:px-1 relative overflow-hidden">
      {/* Language toggle */}
      <button
        onClick={toggleLanguage}
        className="absolute top-4 right-4 px-3 py-1 rounded-full border border-current text-sm"
      >
        {language === "en" ? "RU" : "EN"}
      </button>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor:
                i % 2 === 0 ? "var(--color-blue)" : "var(--color-orange)",
              transform: `translate(${position.x * (i + 1) * 20}px, ${
                position.y * (i + 1) * 20
              }px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <h1 className="text-9xl font-bold mb-2 xxs:text-7xl">404</h1>

        <div className="relative mb-8">
          <div className="h-4 mb-4"></div>
          <h2 className="text-2xl font-bold mb-2 xxs:text-xl">{t.notFound}</h2>
          <p className="text-gray-500 mb-6 xxs:text-xs">{t.description}</p>
        </div>

        <Link
          href="/"
          className="px-6 py-3 xxs:px-4 xxs:py-2 xxs:text-xs rounded-full bg-blue-600 text-white font-medium transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t.returnHome}
        </Link>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 xxs:gap-2 opacity-70"
        style={{
          transform: `translate(calc(-50% + ${position.x * 10}px), ${
            position.y * 10
          }px)`,
          transition: "transform 0.5s ease-out",
        }}
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-32 h-1 xxs:w-[100px] xxs:h-[3px] rounded-full"
            style={{
              backgroundColor:
                i % 2 === 0 ? "var(--color-blue)" : "var(--color-orange)",
              opacity: 0.7 - i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
