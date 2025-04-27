"use client";

import { Home, Search, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function BottomTab() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: "home", icon: Home, path: "/" },
    { id: "search", icon: Search, path: "/search" },
    { id: "profile", icon: User, path: "/profile/1" },
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

          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center ${
                isActive ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => handleTabClick(tab.path)}
            >
              <Icon size={24} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
