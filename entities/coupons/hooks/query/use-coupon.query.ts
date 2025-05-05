"use client";

import { useQuery } from "@tanstack/react-query";
import { couponApi } from "../../api/coupons.api";

export const couponKeys = {
  all: ["coupons"] as const,
  lists: () => [...couponKeys.all, "list"] as const,
  list: (filters: string) => [...couponKeys.lists(), { filters }] as const,
  details: () => [...couponKeys.all, "detail"] as const,
  detail: (id: number) => [...couponKeys.details(), id] as const,
};

// Hook to get all coupons (admin only)
export const useAllCoupons = () => {
  return useQuery({
    queryKey: couponKeys.lists(),
    queryFn: () => couponApi.getAllCoupons(),
  });
};
