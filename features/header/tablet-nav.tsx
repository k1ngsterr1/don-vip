"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface TabletNavProps {
  activeMenu: "services" | null;
  onMenuToggle: (menu: "services") => void;
  t: (key: string) => string;
}

export function TabletNav({ activeMenu, onMenuToggle }: TabletNavProps) {
  const t = useTranslations("Header");

  return (
    <nav className="flex items-center space-x-4">
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
