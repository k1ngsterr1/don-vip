"use client";

import HomeIcon from "@/shared/icons/home-icon";
import UserIcon from "@/shared/icons/user-icon";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function BottomTab() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: "home", icon: HomeIcon, path: "/" },
    { id: "search", icon: Search, path: "/search" },
    { id: "profile", icon: UserIcon, path: "/profile/1" },
  ];

  const handleTabClick = (tabPath: string) => {
    router.push(tabPath);
  };

  return (
    <div className="fixed bottom-0 h-[64px] px-[60px] flex items-center justify-center w-full left-0 right-0 bg-[#F3F4F7] border-t border-gray-200 py-2">
      <div className="flex w-full justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            pathname === tab.path ||
            (tab.id === "profile" && pathname.startsWith("/profile"));

          const iconColor = isActive ? "#3B82F6" : "#AAAAAB"; // Blue when active, gray when inactive

          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center ${
                isActive ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => handleTabClick(tab.path)}
            >
              {tab.id === "search" ? (
                <Icon size={24} color={iconColor} />
              ) : (
                <Icon size={24} color={iconColor} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
