"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

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
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[2px] w-1 h-1 bg-blue-600 rounded-full"
          layoutId="navIndicator"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </div>
  );
}
