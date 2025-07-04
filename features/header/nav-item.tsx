"use client";

import { Link } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";

interface NavItemProps {
  label: string;
  href?: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function NavItem({
  label,
  href,
  isActive,
  hasSubmenu,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: NavItemProps) {
  if (!hasSubmenu && href) {
    return (
      <div className="relative">
        <Link
          //@ts-ignore
          href={href}
          className="text-dark font-condensed hover:text-blue-600 transition-colors text-base"
        >
          {label}
        </Link>
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        className={`flex items-center text-dark font-condensed hover:text-blue-600 transition-colors text-base ${
          isActive ? "text-blue-600" : ""
        }`}
        onClick={onClick}
      >
        {label}
        {hasSubmenu && (
          <ChevronDown
            size={16}
            className={`ml-1 transition-transform duration-300 ${
              isActive ? "rotate-180" : "rotate-0"
            }`}
          />
        )}
      </button>
    </div>
  );
}
