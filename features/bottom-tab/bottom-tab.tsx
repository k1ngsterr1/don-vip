"use client";

import { useAuthStore } from "@/entities/auth/store/auth.store";
import { useRouter } from "@/i18n/routing";
import HomeIcon from "@/shared/icons/home-icon";
import UserIcon from "@/shared/icons/user-icon";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BottomTab() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();

  const tabs = [
    { id: "home", icon: HomeIcon, path: "/" },
    { id: "search", icon: Search, path: "/search" },
    {
      id: "profile",
      icon: UserIcon,
      path: isAuthenticated && user?.id ? `/profile/${user.id}` : "/auth/login",
    },
  ];

  const handleTabClick = (tabPath: string) => {
    router.push(tabPath as any);
  };

  const isTabActive = (tabId: string, tabPath: string) => {
    if (tabId === "home") {
      return /^\/[a-z]{2}$/.test(pathname); // /ru, /en, /de и т.п.
    }
    if (tabId === "search") {
      return pathname.includes("/search");
    }
    if (tabId === "profile") {
      return pathname.includes("/profile");
    }
    return pathname === tabPath;
  };

  return (
    <div className="fixed md:hidden bottom-0 h-[64px] px-[60px] flex items-center justify-center w-full left-0 right-0 bg-[#F3F4F7] border-t border-gray-200 py-2">
      <div className="flex w-full justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = isTabActive(tab.id, tab.path);
          const iconColor = isActive ? "#3B82F6" : "#AAAAAB";

          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center ${
                isActive ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => handleTabClick(tab.path)}
            >
              <Icon size={24} color={iconColor} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
