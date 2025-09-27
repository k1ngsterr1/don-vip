"use client";

import { useEffect } from "react";
import { X, Info, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface ValidationToastProps {
  isVisible: boolean;
  type?: "info" | "error" | "success";
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function ValidationToast({
  isVisible,
  type = "info",
  message,
  onClose,
  autoClose = true,
  duration = 4000,
}: ValidationToastProps) {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const IconComponent =
    type === "error" ? AlertCircle : type === "success" ? CheckCircle : Info;

  const iconColor =
    type === "error"
      ? "text-red-500"
      : type === "success"
      ? "text-green-500"
      : "text-blue-500";

  const borderColor =
    type === "error"
      ? "border-red-200"
      : type === "success"
      ? "border-green-200"
      : "border-blue-200";

  const bgColor =
    type === "error"
      ? "bg-red-50"
      : type === "success"
      ? "bg-green-50"
      : "bg-blue-50";

  return (
    <div
      className={cn(
        "flex items-start space-x-3 p-4 rounded-lg border shadow-sm transition-all duration-300 animate-in slide-in-from-top-2 fade-in",
        bgColor,
        borderColor
      )}
      role="alert"
      aria-live="polite"
    >
      <IconComponent
        className={cn("h-5 w-5 mt-0.5 flex-shrink-0", iconColor)}
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 font-medium">{message}</p>
      </div>

      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-full hover:bg-white/50"
        aria-label="Закрыть уведомление"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
