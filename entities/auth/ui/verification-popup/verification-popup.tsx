"use client";

import type React from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface VerificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationPopup: React.FC<VerificationPopupProps> = ({
  isOpen,
  onClose,
}) => {
  const t = useTranslations("verification-popup");

  if (!isOpen) return null;

  const handleVerifyNow = () => {
    window.location.href = "/auth/verify";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label={t("close")}
        >
          <X size={20} />
        </button>
        <div className="mb-4 text-center">
          <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-medium text-gray-900">
            {t("title")}
          </h3>
          <p className="text-gray-600">{t("description")}</p>
        </div>
        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            {t("closeButton")}
          </button>
          <button
            onClick={handleVerifyNow}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {t("verifyButton")}
          </button>
        </div>
      </div>
    </div>
  );
};
