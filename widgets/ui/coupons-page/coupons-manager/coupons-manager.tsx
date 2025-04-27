"use client";

import { useState } from "react";
import { ActivatedCouponWidget } from "../activated-coupon/activated-coupon";
import { AppliedCouponWidget } from "../applied-coupon/applied-coupon";
import { CouponInputWidget } from "../coupon-input/coupon-input";
import { EmptyCouponsWidget } from "../empty-coupons/empty-coupons";

type CouponState = "empty" | "input" | "applied" | "activated";

interface CouponData {
  code: string;
  game?: string;
  discount: number;
  minAmount?: number;
}

export function CouponsManagerWidget() {
  const [state, setState] = useState<CouponState>("empty");
  const [couponData, setCouponData] = useState<CouponData | null>(null);

  const handleShowInput = () => {
    setState("input");
  };

  const handleApplyCode = (code: string) => {
    // In a real app, this would validate the code with an API
    if (code === "MLBB75353945") {
      setCouponData({
        code,
        game: "Mobile Legends: Bang Bang",
        discount: 10,
        minAmount: 1000,
      });
    } else {
      setCouponData({
        code,
        discount: 5,
      });
    }
    setState("applied");
  };

  const handleActivate = () => {
    setState("activated");
  };

  const handleGoToStore = () => {
    // In a real app, this would navigate to the store
    alert("Navigating to store...");
    // Reset state for demo purposes
    setState("empty");
    setCouponData(null);
  };

  return (
    <>
      {state === "empty" && (
        <EmptyCouponsWidget onShowInput={handleShowInput} />
      )}

      {state === "input" && <CouponInputWidget onApply={handleApplyCode} />}

      {state === "applied" && couponData && (
        <AppliedCouponWidget
          couponData={couponData}
          onActivate={handleActivate}
        />
      )}

      {state === "activated" && (
        <ActivatedCouponWidget onGoToStore={handleGoToStore} />
      )}
    </>
  );
}
