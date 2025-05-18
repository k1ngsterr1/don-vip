"use client";

import { motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

interface ActivatedCouponWidgetProps {
  onGoToStore: () => void;
  totalDiscount?: number;
}

export function ActivatedCouponWidget({
  onGoToStore,
  totalDiscount = 0,
}: ActivatedCouponWidgetProps) {
  const t = useTranslations("couponsActivated");

  // Mobile version
  const mobileVersion = (
    <div className="bg-gray-50 p-6 rounded-lg text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="font-medium text-lg mb-2">{t("title")}</h3>
      <p className="text-sm text-gray-600 mb-6">{t("description")}</p>
      {totalDiscount > 0 && (
        <p className="text-blue font-medium mb-4">
          {t("discountApplied", { discount: totalDiscount })}
        </p>
      )}
      <button
        onClick={onGoToStore}
        className="px-6 py-3 bg-blue text-white rounded-full font-medium hover:bg-blue-600 transition-colors w-full"
      >
        {t("goToStore")}
      </button>
    </div>
  );

  // Desktop version (enhanced)
  const desktopVersion = (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 shadow-sm border border-gray-200 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md"
      >
        <Check className="w-12 h-12 text-green-600" />
      </motion.div>
      <h3 className="font-medium text-2xl mb-3 font-unbounded text-gray-800">
        {t("title")}
      </h3>
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        {t("fullDescription")}
      </p>
      {totalDiscount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 p-4 rounded-lg mb-8 inline-block"
        >
          <p className="text-blue-700 font-medium text-lg">
            {t("discountApplied", { discount: totalDiscount })}
          </p>
        </motion.div>
      )}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGoToStore}
        className="px-8 py-4 bg-blue text-white rounded-full font-medium text-lg shadow-md hover:shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center mx-auto"
      >
        <ShoppingBag className="mr-2" />
        <span>{t("goToStore")}</span>
      </motion.button>
    </div>
  );

  return (
    <>
      <div className="block md:hidden">{mobileVersion}</div>
      <div className="hidden md:block">{desktopVersion}</div>
    </>
  );
}
