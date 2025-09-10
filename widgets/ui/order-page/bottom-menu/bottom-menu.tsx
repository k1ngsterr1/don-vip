"use client";

import { cn } from "@/shared/utils/cn";
import Link from "next/link";

interface MenuTab {
  id: string;
  label: string;
  icon: string;
  href: string;
}

interface BottomMenuProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

const menuTabs: MenuTab[] = [
  { id: "home", label: "Главная", icon: "🏠", href: "/" },
  { id: "search", label: "Поиск", icon: "🔍", href: "/search" },
  { id: "profile", label: "Профиль", icon: "👤", href: "/profile" },
];

export function BottomMenu({
  activeTab = "home",
  onTabChange,
}: BottomMenuProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#f3f4f7] border-t border-gray-200 px-16 py-4 md:hidden">
      <div className="flex items-center justify-between">
        {menuTabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            onClick={() => onTabChange?.(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 text-xs transition-colors",
              activeTab === tab.id
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            )}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
