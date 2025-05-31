"use client";

import { cn } from "@/shared/utils/cn";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductInfoProps {
  isExpanded: boolean;
  onToggle: () => void;
  description: string;
}

export function ProductInfo({
  isExpanded,
  onToggle,
  description,
}: ProductInfoProps) {
  const mobileInfo = (
    <div className="md:hidden px-4 mt-8 mb-6">
      <div
        className={cn(
          "bg-blue rounded-xl text-white w-full max-w-md mx-auto transition-all duration-300 ease-in-out overflow-hidden"
        )}
      >
        <button
          className="w-full py-3 px-4 flex items-center justify-between text-left"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls="product-description-content"
        >
          <span className="font-medium">Информация о товаре</span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {isExpanded && (
          <div
            id="product-description-content"
            className="px-4 pb-4 pt-1 text-sm" // Added pt-1 for a little space
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );

  return mobileInfo;
}
