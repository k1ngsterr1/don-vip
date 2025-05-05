"use client";
import { useTranslations } from "next-intl";

interface AuthLoadingOverlayProps {
  isVisible: boolean;
  state: "loading" | "redirecting" | "processing";
  message?: string;
  className?: string;
}

export function AuthLoadingOverlay({
  isVisible,
  state = "loading",
  message,
  className = "",
}: AuthLoadingOverlayProps) {
  const i18n = useTranslations("auth.loading");

  // Default messages based on state
  const getDefaultMessage = () => {
    switch (state) {
      case "loading":
        return i18n("loading") || "Loading...";
      case "redirecting":
        return i18n("redirecting") || "Redirecting...";
      case "processing":
        return i18n("processing") || "Processing...";
      default:
        return i18n("loading") || "Loading...";
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg transition-all duration-300 ease-in-out ${className}`}
      aria-live="polite"
      role="status"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue animate-spin"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-blue opacity-30"></div>
        </div>
        <p className="text-blue font-medium text-lg animate-pulse">
          {message || getDefaultMessage()}
        </p>
      </div>
    </div>
  );
}
