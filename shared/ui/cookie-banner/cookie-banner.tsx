"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button/button";
import { X } from "lucide-react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [technicalCookies, setTechnicalCookies] = useState(true); // Always true, required
  const [analyticalCookies, setAnalyticalCookies] = useState(true);
  const t = useTranslations("cookieBanner");

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookiesAccepted");
    if (!hasAccepted) {
      setIsVisible(true);
    }

    // Load saved cookie settings
    const savedAnalytical = localStorage.getItem("analyticalCookies");
    if (savedAnalytical !== null) {
      setAnalyticalCookies(savedAnalytical === "true");
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    localStorage.setItem("technicalCookies", "true");
    localStorage.setItem("analyticalCookies", analyticalCookies.toString());
    setIsVisible(false);
    setShowSettings(false);
  };

  const saveCookieSettings = () => {
    localStorage.setItem("cookiesAccepted", "true");
    localStorage.setItem("technicalCookies", "true"); // Always true
    localStorage.setItem("analyticalCookies", analyticalCookies.toString());
    setIsVisible(false);
    setShowSettings(false);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600">
            {t("message") ||
              "Мы используем cookie. Они помогают нам понять, как вы взаимодействуете с сайтом."}{" "}
            <button
              onClick={openSettings}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              {t("learnMore") || "Изменить настройки"}
            </button>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={acceptCookies}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
          >
            {t("accept") || "ОК"}
          </Button>
        </div>
      </div>

      {/* Cookie Settings Popup */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/30 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {t("settingsTitle") || "Настройка cookie-файлов"}
              </h3>
              <button
                onClick={closeSettings}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {t("technicalCookies") || "Технические cookie-файлы"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("technicalDescription") || "Необходимы для работы сайта"}
                  </p>
                </div>
                <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center justify-end px-1 cursor-not-allowed">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {t("analyticalCookies") || "Аналитические cookie-файлы"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("analyticalDescription") || "Помогают улучшить сайт"}
                  </p>
                </div>
                <button
                  onClick={() => setAnalyticalCookies(!analyticalCookies)}
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors cursor-pointer ${
                    analyticalCookies
                      ? "bg-green-500 justify-end"
                      : "bg-gray-300 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full transition-transform"></div>
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={saveCookieSettings}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t("accept") || "ОК"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
