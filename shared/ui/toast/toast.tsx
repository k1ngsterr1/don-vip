"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import { useLocale } from "next-intl";

export interface ToastProps {
  message: string;
  type?: "success" | "info" | "warning" | "error";
  duration?: number;
  onClose?: () => void;
}

export function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300); // Allow fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const getToastStyles = () => {
    const baseStyles =
      "fixed top-4 right-4 z-50 max-w-sm w-full shadow-lg rounded-lg p-4 transition-all duration-300 transform";

    if (!isVisible) {
      return `${baseStyles} translate-x-full opacity-0`;
    }

    switch (type) {
      case "success":
        return `${baseStyles} bg-green-50 border border-green-200 text-green-800`;
      case "error":
        return `${baseStyles} bg-red-50 border border-red-200 text-red-800`;
      case "warning":
        return `${baseStyles} bg-yellow-50 border border-yellow-200 text-yellow-800`;
      default:
        return `${baseStyles} bg-blue-50 border border-blue-200 text-blue-800`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <X className="w-5 h-5 text-red-600" />;
      case "warning":
        return <X className="w-5 h-5 text-yellow-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);
  const locale = useLocale();

  const addToast = (toast: Omit<ToastProps, "onClose">) => {
    const id = Date.now().toString();
    const newToast = {
      ...toast,
      id,
      onClose: () => removeToast(id),
    };

    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showAccountSavedToast = (accountId: string) => {
    const message =
      locale === "ru"
        ? `Аккаунт ${accountId} сохранен для быстрого доступа`
        : `Account ${accountId} saved for quick access`;

    addToast({
      message,
      type: "success",
      duration: 2000,
    });
  };

  const showCookieConsentToast = () => {
    const message =
      locale === "ru"
        ? "Мы используем cookies для сохранения ваших данных и улучшения работы сайта"
        : "We use cookies to save your data and improve site performance";

    addToast({
      message,
      type: "info",
      duration: 5000,
    });
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={toast.onClose}
        />
      ))}
    </>
  );

  return {
    addToast,
    showAccountSavedToast,
    showCookieConsentToast,
    ToastContainer,
  };
}
