"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface TabletNavProps {
  activeMenu: "games" | "services" | null;
  onMenuToggle: (menu: "games" | "services") => void;
}

export function TabletNav({ activeMenu, onMenuToggle }: TabletNavProps) {
  const t = useTranslations("Header");

  return (
    <nav className="flex items-center space-x-4">
      <button
        className={`flex items-center text-sm font-medium transition-colors ${
          activeMenu === "games"
            ? "text-blue-600"
            : "text-gray-700 hover:text-gray-900"
        }`}
        onClick={() => onMenuToggle("games")}
        aria-expanded={activeMenu === "games"}
      >
        {t("games")}
        <ChevronDown
          size={16}
          className={`ml-1 transition-transform ${
            activeMenu === "games" ? "rotate-180" : ""
          }`}
        />
      </button>

      <button
        className={`flex items-center text-sm font-medium transition-colors ${
          activeMenu === "services"
            ? "text-blue-600"
            : "text-gray-700 hover:text-gray-900"
        }`}
        onClick={() => onMenuToggle("services")}
        aria-expanded={activeMenu === "services"}
      >
        {t("services")}
        <ChevronDown
          size={16}
          className={`ml-1 transition-transform ${
            activeMenu === "services" ? "rotate-180" : ""
          }`}
        />
      </button>
    </nav>
  );
}
