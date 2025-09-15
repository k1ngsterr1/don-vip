"use client";

import { useState } from "react";
import { cn } from "@/shared/utils/cn";
import { useLocale } from "next-intl";

interface PromoBlockProps {
  onLoginClick?: () => void;
}

export function PromoBlock({ onLoginClick }: PromoBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const locale = useLocale();

  // Хардкодные переводы
  const translations = {
    ru: {
      loginText:
        "Войдите и получите купон на скидку 5% за подписку на наш Telegram канал",
      loginButton: "Войти",
    },
    en: {
      loginText:
        "Login and get a 5% discount coupon for subscribing to our Telegram channel",
      loginButton: "Login",
    },
  };

  const t =
    translations[locale as keyof typeof translations] || translations.ru;

  return (
    <div className="px-4 py-4">
      <div className="bg-[#eeeff3] rounded-xl p-4">
        <div className="flex items-center gap-3">
          {/* Coupon Icon */}
          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs">🎫</span>
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-gray-800 text-sm leading-relaxed">
              {t.loginText}
            </p>
          </div>

          {/* Login Button - теперь ведет на Telegram */}
          <a
            href="https://t.me/DON_VIPCOM"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {t.loginButton}
          </a>
        </div>
      </div>
    </div>
  );
}
