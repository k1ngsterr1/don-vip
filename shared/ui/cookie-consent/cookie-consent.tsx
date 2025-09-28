"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Cookie, X, Check } from "lucide-react";
import { CookieManager, COOKIE_NAMES } from "@/shared/utils/cookies";

const COOKIE_CONSENT_KEY = "cookie_consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = CookieManager.get(COOKIE_CONSENT_KEY);
    if (!hasConsent) {
      // Show consent banner after a short delay
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const texts = {
    ru: {
      title: "Мы используем файлы cookie",
      description:
        "Этот сайт использует cookie для сохранения ваших игровых данных, предпочтений и обеспечения лучшего пользовательского опыта. Продолжая использование сайта, вы соглашаетесь с использованием cookie.",
      accept: "Принять",
      decline: "Отклонить",
      learnMore: "Подробнее",
      benefits: [
        "Сохранение ваших игровых аккаунтов для быстрого доступа",
        "Запоминание предпочтений валюты и языка",
        "Улучшение работы сайта и персонализация",
      ],
    },
    en: {
      title: "We use cookies",
      description:
        "This website uses cookies to save your game data, preferences and provide better user experience. By continuing to use the site, you agree to the use of cookies.",
      accept: "Accept",
      decline: "Decline",
      learnMore: "Learn more",
      benefits: [
        "Save your game accounts for quick access",
        "Remember currency and language preferences",
        "Improve site performance and personalization",
      ],
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  const handleAccept = () => {
    CookieManager.set(COOKIE_CONSENT_KEY, "accepted", {
      expires: 365, // 1 year
    });
    setIsVisible(false);
  };

  const handleDecline = () => {
    CookieManager.set(COOKIE_CONSENT_KEY, "declined", {
      expires: 30, // 30 days
    });
    // Clear any existing cookies except essential ones
    CookieManager.remove(COOKIE_NAMES.GUEST_CLIENT_ID);
    CookieManager.remove(COOKIE_NAMES.RECENT_ORDERS);
    CookieManager.remove(COOKIE_NAMES.SAVED_GAME_DATA);
    CookieManager.remove(COOKIE_NAMES.USER_PREFERENCES);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <Cookie className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{t.title}</h2>
            <button
              onClick={handleDecline}
              className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {t.description}
          </p>

          {/* Benefits */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {locale === "ru" ? "Что это дает:" : "Benefits:"}
            </p>
            <ul className="space-y-1">
              {t.benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              {t.accept}
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              {t.decline}
            </button>
          </div>

          {/* Learn more link */}
          <div className="mt-4 text-center">
            <button className="text-xs text-blue-600 hover:text-blue-800 underline">
              {t.learnMore}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility to check if cookies are accepted
export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = CookieManager.get(COOKIE_CONSENT_KEY);
    setHasConsent(consent === "accepted");
  }, []);

  return {
    hasConsent,
    isConsentGiven: hasConsent === true,
    isConsentDeclined: hasConsent === false,
  };
}
