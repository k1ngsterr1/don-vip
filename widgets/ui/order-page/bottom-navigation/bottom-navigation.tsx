"use client";

import { cn } from "@/shared/utils/cn";

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
          <div className="w-4 h-4 mb-1">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full text-gray-600"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
        </button>

        {/* Search */}
        <button className="flex flex-col items-center">
          <div className="w-4 h-4 mb-1">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full text-gray-600"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
        </button>

        {/* Profile/Account */}
        <button className="flex flex-col items-center">
          <div className="w-4 h-4 mb-1">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full text-gray-600"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
