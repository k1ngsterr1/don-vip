"use client";

import { useState } from "react";
import { useCheckCoupon } from "../mutations/use-coupon.mutation";

export type CouponState = "empty" | "input" | "applied" | "activated";

export interface CouponData {
  code: string;
  game?: string;
  discount: number;
  minAmount?: number;
}

export function useCouponManager() {
  const [state, setState] = useState<CouponState>("empty");
  const [couponData, setCouponData] = useState<CouponData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkCouponMutation = useCheckCoupon();

  const handleShowInput = () => {
    setState("input");
    setError(null);
  };

  const handleApplyCode = async (code: string) => {
    try {
      setError(null);
      // Call the API to check the coupon
      const result = await checkCouponMutation.mutateAsync({ code });

      if (result.valid && result.coupon) {
        setCouponData({
          code,
          discount: result.coupon.discount,
          // You can add additional fields from the backend if needed
          game: result.coupon.game || undefined,
          minAmount: result.coupon.minAmount || undefined,
        });
        setState("applied");
      } else {
        setError(result.message || "Invalid coupon code");
        // Stay in input state to allow the user to try again
      }
    } catch (err) {
      setError("Failed to validate coupon. Please try again.");
    }
  };

  const handleActivate = () => {
    setState("activated");
  };

  const handleGoToStore = () => {
    // Reset state
    setState("empty");
    setCouponData(null);
    setError(null);

    // In a real app, you would navigate to the store
    // router.push('/store')
  };

  return {
    state,
    couponData,
    error,
    isLoading: checkCouponMutation.isPending,
    handleShowInput,
    handleApplyCode,
    handleActivate,
    handleGoToStore,
  };
}
