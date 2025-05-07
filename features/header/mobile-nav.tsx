"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { LogOut } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onLogout: () => void;
  isAuthenticated: boolean;
}

export function MobileNav({
  isOpen,
  onLogout,
  isAuthenticated,
}: MobileNavProps) {
  const t = useTranslations("Header");

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white py-2 px-4 border-t border-gray-100">
      <nav className="space-y-3">
        <Link href="/games" className="block text-dark font-condensed">
          {t("games")}
        </Link>
        <Link href="/services" className="block text-dark font-condensed">
          {t("services")}
        </Link>
        <Link href="/reviews" className="block text-dark font-condensed">
          {t("reviews")}
        </Link>
        <Link href="/faq" className="block text-dark font-condensed">
          {t("faq")}
        </Link>
        {isAuthenticated && (
          <button onClick={onLogout} className="flex items-center text-red-600">
            <LogOut size={16} className="mr-2" />
            {t("logout")}
          </button>
        )}
      </nav>
    </div>
  );
}
