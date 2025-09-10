"use client";

import { useState } from "react";
import { cn } from "@/shared/utils/cn";

interface PromoBlockProps {
  onLoginClick?: () => void;
}

export function PromoBlock({ onLoginClick }: PromoBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="px-4 py-4">
      <div className="bg-[#eeeff3] rounded-xl p-4">
        <div className="flex items-center gap-3">
          {/* Coupon Icon */}
          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs">🎫</span>
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-gray-800 text-sm leading-relaxed">
              <span className="uppercase">В</span>
              <span className="lowercase">
                ойдите и получите купон на скидку 5% за подписку на наш
              </span>{" "}
              <span className="uppercase">T</span>
              <span className="lowercase">elegram канал</span>
            </p>
          </div>

          {/* Login Button */}
          <button
            onClick={onLoginClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            войти
          </button>
        </div>
      </div>
    </div>
  );
}
