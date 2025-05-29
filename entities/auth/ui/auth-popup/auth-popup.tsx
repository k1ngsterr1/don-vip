"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { X, LogIn } from "lucide-react";

interface AuthorizationPopupProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AuthorizationPopup({
  isOpen,
  onOpenChange,
}: AuthorizationPopupProps) {
  const t = useTranslations("authPopup");
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onOpenChange]);

  const handleSignIn = () => {
    router.push("/auth/register" as any);
    onOpenChange(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out scale-100 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center pt-8 pb-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h2>
        </div>
        <div className="px-8 pb-2">
          <p className="text-gray-600 text-center leading-relaxed mb-6">
            {t("description")}
          </p>
        </div>
        <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t("cancelButton")}
          </button>
          <button
            onClick={handleSignIn}
            className="flex-1 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {t("signInButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
