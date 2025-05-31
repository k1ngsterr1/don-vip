"use client";

import type React from "react";
import { X, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

interface VerificationPopupProps {
  isOpen: boolean;
  onClose: () => void; // Added onClose prop
}

export const VerificationPopup: React.FC<VerificationPopupProps> = ({
  isOpen,
  onClose, // Destructure onClose
}) => {
  const t = useTranslations("verification-popup");
  const router = useRouter();

  if (!isOpen) return null;

  const handleVerifyNow = () => {
    router.push("/auth/verify");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <button
          onClick={onClose} // Use onClose for the X button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label={t("close")}
        >
          <X size={20} />
        </button>
        <div className="mb-4 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
            {t("title")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("description")}
          </p>
        </div>
        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose} // Use onClose for the "Close" button
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {t("closeButton")}
          </button>
          <button
            onClick={handleVerifyNow} // Keep handleVerifyNow for the "Verify" button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {t("verifyButton")}
          </button>
        </div>
      </div>
    </div>
  );
};
