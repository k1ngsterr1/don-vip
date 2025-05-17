"use client";

import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  discount: number;
  autoCloseDelay?: number;
}

export function SuccessPopup({
  isOpen,
  onClose,
  code,
  discount,
  autoCloseDelay = 3000,
}: SuccessPopupProps) {
  const t = useTranslations("couponsManager");

  // Auto close after delay
  useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoCloseDelay]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Success icon */}
              <div className="bg-green-50 p-6 flex justify-center">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {t("successTitle")}
                </h3>
                <p className="text-gray-600">
                  {t.rich("successDescription", {
                    code: (chunks) => (
                      <span className="font-semibold text-gray-800">
                        {code}
                      </span>
                    ),
                    discount: (chunks) => (
                      <span className="font-semibold text-gray-800">
                        {discount}%
                      </span>
                    ),
                  })}
                </p>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {t("successButtonClose")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
