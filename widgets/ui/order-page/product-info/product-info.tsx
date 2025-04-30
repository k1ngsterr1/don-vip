"use client";

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
  // Mobile version (unchanged)
  const mobileInfo = (
    <div className="md:hidden">
      <button
        className="w-full bg-blue text-white py-3 px-4 flex items-center justify-center mb-6"
        onClick={onToggle}
      >
        <span>Информация о товаре</span>
        {isExpanded ? (
          <ChevronUp className="ml-2" size={18} />
        ) : (
          <ChevronDown className="ml-2" size={18} />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 py-3 bg-blue/10 mb-6 text-sm">
          <p>{description}</p>
        </div>
      )}
    </div>
  );

  // Desktop version is not needed as we're displaying the description directly in the main content area
  return mobileInfo;
}
