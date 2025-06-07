"use client";

import { useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: "error" | "success" | "info";
}

export function CustomAlert({
  isOpen,
  onClose,
  title,
  message,
  type = "error",
}: CustomAlertProps) {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("alert");

  const alertTitle =
    title ||
    (type === "error"
      ? t("alerts.errorTitle")
      : type === "success"
      ? t("alerts.successTitle")
      : t("alerts.infoTitle"));

  useEffect(() => {
    setMounted(true);

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    // Handle escape key press
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const AlertIcon =
    type === "error" ? AlertCircle : type === "success" ? CheckCircle : Info;

  const iconColor =
    type === "error"
      ? "text-red-500"
      : type === "success"
      ? "text-green-500"
      : "text-blue";

  const alertContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-md rounded-lg shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby="alert-message"
      >
        <div className="bg-white text-dark rounded-t-lg p-5 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <AlertIcon className={`h-5 w-5 ${iconColor}`} />
              <span
                id="alert-title"
                className="text-blue font-condensed font-medium text-lg"
              >
                {alertTitle}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white text-dark p-5 pt-4">
          <p
            id="alert-message"
            className="font-roboto text-sm text-gray-700 leading-relaxed"
          >
            {message}
          </p>
        </div>

        <div className="bg-white rounded-b-lg p-4 pt-0 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-md transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-50"
            autoFocus
          >
            {t("alerts.okButton")}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(alertContent, document.body);
}
