import React from "react";

export const PurchaseCardSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center bg-[#F3F4F7] rounded-[8px] px-4 py-3 gap-2 animate-pulse">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="h-3 w-32 bg-gray-300 rounded"></div>
        </div>
        <div className="h-5 w-20 bg-gray-300 rounded-full"></div>
      </div>
      <div className="w-full flex items-center gap-4">
        <div className="w-[48px] h-[48px] bg-gray-300 rounded-full"></div>
        <div className="relative w-[48px] h-[48px]">
          <div className="w-[48px] h-[48px] bg-gray-300 rounded-full"></div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
