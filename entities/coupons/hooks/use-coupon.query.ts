"use client";

import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { couponApi } from "../api/coupons.api";

/**
 * Hook to get all coupons (admin only)
 */
export function useAllCoupons() {
  return useQuery({
    queryKey: queryKeys.coupons.lists(),
    queryFn: () => couponApi.getAllCoupons(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a specific coupon by ID
 */
export function useCoupon(
  id: number | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: id ? queryKeys.coupons.detail(id) : queryKeys.coupons.details(),
    queryFn: () => {
      if (!id) throw new Error("Coupon ID is required");

      // Since there's no direct endpoint to get a single coupon,
      // we'll get all coupons and filter
      return couponApi.getAllCoupons().then((coupons) => {
        const coupon = coupons.find((c) => c.id === id);
        if (!coupon) throw new Error(`Coupon with ID ${id} not found`);
        return coupon;
      });
    },
    enabled: !!id && options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
