"use client";

import { AnimatePresence, motion } from "framer-motion";
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

  // Animation variants - only for desktop
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="md:max-w-2xl md:mx-auto">
      {/* Use AnimatePresence only for desktop */}
      <div className="block md:hidden">
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
              <CouponInputWidget onApply={handleApplyCode} />
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
