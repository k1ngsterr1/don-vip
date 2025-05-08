"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { LogOut, X } from "lucide-react";
import { useEffect } from "react";

interface MobileNavProps {
  isOpen: boolean;
  onLogout: () => void;
  isAuthenticated: boolean;
  isTablet?: boolean;
}

export function MobileNav({
  isOpen,
  onLogout,
  isAuthenticated,
  isTablet = false,
}: MobileNavProps) {
  const t = useTranslations("Header");

  // Close mobile menu when escape key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        document.dispatchEvent(new CustomEvent("closeMobileMenu"));
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine the appropriate class based on device type
  const containerClass = isTablet
    ? "lg:hidden bg-white py-3 px-5 border-t border-gray-100" // Tablet
    : "md:hidden bg-white py-2 px-4 border-t border-gray-100"; // Mobile

  return (
    <div className={containerClass}>
      {isTablet && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium text-lg">{t("menu")}</h2>
          <button
            onClick={() =>
              document.dispatchEvent(new CustomEvent("closeMobileMenu"))
            }
            aria-label="Close menu"
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
      )}

      <nav className={`space-y-${isTablet ? "4" : "3"}`}>
        <Link
          href="/games"
          className={`block text-dark font-condensed ${
            isTablet ? "text-lg py-1" : ""
          }`}
        >
          {t("games")}
        </Link>
        <Link
          href="/services"
          className={`block text-dark font-condensed ${
            isTablet ? "text-lg py-1" : ""
          }`}
        >
          {t("services")}
        </Link>
        <Link
          href="/reviews"
          className={`block text-dark font-condensed ${
            isTablet ? "text-lg py-1" : ""
          }`}
        >
          {t("reviews")}
        </Link>
        <Link
          href="/faq"
          className={`block text-dark font-condensed ${
            isTablet ? "text-lg py-1" : ""
          }`}
        >
          {t("faq")}
        </Link>

        {isAuthenticated && (
          <button
            onClick={onLogout}
            className={`flex items-center text-red-600 ${
              isTablet ? "mt-4 text-lg" : ""
            }`}
          >
            <LogOut size={isTablet ? 18 : 16} className="mr-2" />
            {t("logout")}
          </button>
        )}
      </nav>
    </div>
  );
}
