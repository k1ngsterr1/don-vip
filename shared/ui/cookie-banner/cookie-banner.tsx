"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button/button";
import { X } from "lucide-react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations("cookieBanner");

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookiesAccepted");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookiesAccepted", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600">
            {t("message") ||
              "Мы используем cookie. Они помогают нам понять, как вы взаимодействуете с сайтом."}{" "}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              {t("learnMore") || "Изменить настройки"}
            </a>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={declineCookies}
            variant="secondary"
            className="text-gray-600 hover:bg-gray-50 px-4 py-2 text-sm"
          >
            {t("decline") || "Отклонить"}
          </Button>
          <Button
            onClick={acceptCookies}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
          >
            {t("accept") || "ОК"}
          </Button>
        </div>

        <button
          onClick={declineCookies}
          className="absolute top-2 right-2 md:hidden p-2 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
