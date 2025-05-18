"use client";

interface AuthLoadingOverlayProps {
  isVisible: boolean;
  state: "loading" | "redirecting" | "processing";
  className?: string;
}

export function AuthLoadingOverlay({
  isVisible,
  className = "",
}: AuthLoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className={`absolute w-full h-full inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg transition-all duration-300 ease-in-out ${className}`}
      aria-live="polite"
      role="status"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue animate-spin"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-blue opacity-30"></div>
        </div>
      </div>
    </div>
  );
}
