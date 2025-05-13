"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCouponDto,
  couponApi,
  CreateCouponDto,
  UpdateCouponDto,
} from "../../api/coupons.api";

export const couponKeys = {
  all: ["coupons"] as const,
  lists: () => [...couponKeys.all, "list"] as const,
  list: (filters: any) => [...couponKeys.lists(), { filters }] as const,
  details: () => [...couponKeys.all, "detail"] as const,
  detail: (id: string | number) => [...couponKeys.details(), id] as const,
};

// Hook to check a coupon code
export const useCheckCoupon = () => {
  return useMutation({
    mutationFn: (data: CheckCouponDto) => couponApi.checkCoupon(data),
  });
};

// Hook to create a new coupon (admin only)
export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCouponDto) => couponApi.createCoupon(data),
    onSuccess: () => {
      // Invalidate the coupons list query to refetch
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
    },
  });
};

// Hook to update a coupon (admin only)
export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCouponDto) => couponApi.updateCoupon(data),
    onSuccess: (data) => {
      // Invalidate specific coupon and the list
      queryClient.invalidateQueries({ queryKey: couponKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
    },
  });
};

// Hook to delete a coupon (admin only)
export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => couponApi.deleteCoupon(id),
    onSuccess: () => {
      // Invalidate the coupons list query to refetch
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
    },
  });
};
