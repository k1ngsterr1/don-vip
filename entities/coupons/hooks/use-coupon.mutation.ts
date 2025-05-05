"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  couponApi,
  type CheckCouponDto,
  type CreateCouponDto,
  type UpdateCouponDto,
} from "../api/coupons.api";
import { queryKeys } from "@/shared/config/queryKeys";
import { extractErrorMessage } from "@/shared/config/apiClient";

/**
 * Hook to check a coupon code
 */
export function useCheckCoupon() {
  return useMutation({
    mutationFn: (data: CheckCouponDto) => couponApi.checkCoupon(data),
  });
}

/**
 * Hook to create a new coupon (admin only)
 */
export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCouponDto) => couponApi.createCoupon(data),
    onSuccess: () => {
      // Invalidate the coupons list query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.coupons.lists() });
    },
  });
}

/**
 * Hook to update a coupon (admin only)
 */
export function useUpdateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCouponDto) => couponApi.updateCoupon(data),
    onSuccess: (data) => {
      // Invalidate specific coupon and the list
      if (data.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.coupons.detail(data.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.coupons.lists() });
    },
  });
}

/**
 * Hook to delete a coupon (admin only)
 */
export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => couponApi.deleteCoupon(id),
    onSuccess: () => {
      // Invalidate the coupons list query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.coupons.lists() });
    },
  });
}

/**
 * Combined hook for coupon management
 */
export function useCouponManager() {
  const checkCouponMutation = useCheckCoupon();

  const checkCoupon = async (code: string) => {
    try {
      return await checkCouponMutation.mutateAsync({ code });
    } catch (error) {
      console.error("Failed to check coupon:", extractErrorMessage(error));
      return { valid: false, message: "Failed to check coupon" };
    }
  };

  return {
    checkCoupon,
    isChecking: checkCouponMutation.isPending,
    checkError: checkCouponMutation.error,
  };
}
