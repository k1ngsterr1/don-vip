import type React from "react";
import { PurchaseCardSkeleton } from "./purchase-history-card";

export const PurchaseHistorySkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <PurchaseCardSkeleton key={index} />
      ))}
    </div>
  );
};
