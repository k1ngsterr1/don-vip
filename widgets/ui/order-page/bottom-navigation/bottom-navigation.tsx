"use client";

import { cn } from "@/shared/utils/cn";
import { Home, Search, User } from "lucide-react";

interface BottomNavigationProps {
  className?: string;
}

export function BottomNavigation({ className }: BottomNavigationProps) {
  return (
    <div
      className={cn("bg-[#f3f4f7] border-t border-gray-200 py-4", className)}
    >
      <div className="flex items-center justify-between px-16">
        {/* Home */}
        <button className="flex flex-col items-center">
          <Home className="w-4 h-4 text-gray-600" />
        </button>

        {/* Search */}
        <button className="flex flex-col items-center">
          <Search className="w-4 h-4 text-gray-600" />
        </button>

        {/* Profile/Account */}
        <button className="flex flex-col items-center">
          <User className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
