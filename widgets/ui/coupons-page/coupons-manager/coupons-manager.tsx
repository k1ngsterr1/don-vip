"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ActivatedCouponWidget } from "../activated-coupon/activated-coupon";
import { AppliedCouponWidget } from "../applied-coupon/applied-coupon";
import { CouponInputWidget } from "../coupon-input/coupon-input";
import { EmptyCouponsWidget } from "../empty-coupons/empty-coupons";
import { useTranslations } from "next-intl";
import {
  useApplyCoupon,
  useCheckCoupon,
} from "@/entities/coupons/hooks/use-coupon.mutation";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { getUserId } from "@/shared/hooks/use-get-user-id";

type CouponState = "empty" | "input" | "applied" | "activated";

interface CouponData {
  code: string;
  game?: string;
  discount: number;
  minAmount?: number;
  user_id?: string;
}

export function CouponsManagerWidget() {
  const t = useTranslations("couponsManager");
  const [state, setState] = useState<CouponState>("empty");
  const [couponData, setCouponData] = useState<CouponData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const { user } = useAuthStore();

  const checkCouponMutation = useCheckCoupon();
  const applyCouponMutation = useApplyCoupon();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        if (user && user.id) {
          setUserId(user.id.toString());
          return;
        }
        const id = await getUserId();
        setUserId(id);
      } catch (error) {
        console.error("Failed to get user ID:", error);
        setError(t("errorGettingUserId"));
      }
    };

    fetchUserId();
  }, [user, t]);

  const handleShowInput = () => {
    setState("input");
    setError(null);
  };

  const handleApplyCode = async (code: string) => {
    setError(null);

    if (!userId) {
      setError(t("errorNoUserId"));
      return;
    }

    try {
      // First try to check the coupon
      const checkResult = (await checkCouponMutation.mutateAsync({
        code,
      })) as any;

      // Log the check result to debug
      console.log("Check coupon result:", checkResult);

      const isCouponValid =
        (checkResult.valid && checkResult.coupon) ||
        checkResult.status === "Active" ||
        (checkResult.code && checkResult.discount);

      if (isCouponValid) {
        const appliedCouponResponse = await applyCouponMutation.mutateAsync({
          code,
          user_id: Number.parseInt(userId, 10),
        });

        console.log("Apply coupon result:", appliedCouponResponse);

        const newCouponData: CouponData = {
          code: appliedCouponResponse.code || code,
          discount: appliedCouponResponse.discount,
          user_id: userId,
          game: checkResult.coupon?.limit ? "Limited Offer" : undefined,
          minAmount: checkResult.coupon?.limit || undefined,
        };

        console.log("Setting coupon data:", newCouponData);

        setCouponData(newCouponData);
        setTimeout(() => {
          setState("applied");
        }, 500);
      } else {
        // Handle invalid coupon
        setError(checkResult.message || t("invalidCoupon"));
      }
    } catch (err) {
      console.error("Error applying coupon:", err);
      setError(t("errorApplying"));
    }
  };

  const handleActivate = () => {
    setState("activated");
  };

  const handleGoToStore = () => {
    window.location.href = "/";

    setState("empty");
    setCouponData(null);
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="md:max-w-2xl md:mx-auto">
      <div className="block md:hidden">
        {state === "empty" && (
          <EmptyCouponsWidget onShowInput={handleShowInput} />
        )}
        {state === "input" && (
          <CouponInputWidget
            onApply={handleApplyCode}
            isLoading={
              checkCouponMutation.isPending || applyCouponMutation.isPending
            }
            error={error}
          />
        )}
        {state === "applied" && couponData && (
          <AppliedCouponWidget
            couponData={couponData}
            onActivate={handleActivate}
          />
        )}
        {state === "activated" && (
          <ActivatedCouponWidget onGoToStore={handleGoToStore} />
        )}
      </div>
      <div className="hidden md:block">
        <AnimatePresence mode="wait">
          {state === "empty" && (
            <motion.div
              key="empty"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <EmptyCouponsWidget onShowInput={handleShowInput} />
            </motion.div>
          )}

          {state === "input" && (
            <motion.div
              key="input"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <CouponInputWidget
                onApply={handleApplyCode}
                isLoading={
                  checkCouponMutation.isPending || applyCouponMutation.isPending
                }
                error={error}
              />
            </motion.div>
          )}

          {state === "applied" && couponData && (
            <motion.div
              key="applied"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <AppliedCouponWidget
                couponData={couponData}
                onActivate={handleActivate}
              />
            </motion.div>
          )}

          {state === "activated" && (
            <motion.div
              key="activated"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ActivatedCouponWidget onGoToStore={handleGoToStore} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
