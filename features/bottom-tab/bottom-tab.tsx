"use client";

import { authApi } from "@/entities/auth/api/auth.api";
import { useRouter } from "@/i18n/routing";
import { getUserId } from "@/shared/hooks/use-get-user-id";
import HomeIcon from "@/shared/icons/home-icon";
import UserIcon from "@/shared/icons/user-icon";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function BottomTab() {
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);

  // Update userId on mount and whenever pathname changes to a profile page
  useEffect(() => {
    // Always check localStorage for userId on mount and when pathname changes
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, [pathname]);

  useEffect(() => {
    console.log("userId state updated:", userId);
  }, [userId]);

  const tabs = [
    { id: "home", icon: HomeIcon, path: "/" },
    { id: "search", icon: Search, path: "/search" },
    {
      id: "profile",
      icon: UserIcon,
      path: userId ? `/profile/${userId}` : "/profile/NoUser",
    },
  ];

  // Handle navigation to profile tab
  const handleTabClick = async (tabPath: string) => {
    if (tabPath === "/profile/NoUser") {
      // Simulate guest auth: create guest user and get id
      const guestId = await createGuestUser();
      localStorage.setItem("userId", guestId);
      setUserId(guestId);
      router.push(`/profile/${guestId}` as any);
    } else {
      router.push(tabPath as any);
    }
  };

  // Simulate guest user creation (replace with real API call if needed)
  async function createGuestUser(): Promise<string> {
    const user = await authApi.getCurrentUser();
    return user.id;
  }

  const isTabActive = (tabId: string, tabPath: string) => {
    if (tabId === "home") {
      return /^\/[a-z]{2}$/.test(pathname); // /ru, /en, /de и т.д.
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
