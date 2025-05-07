"use client";

import type React from "react";

import { cn } from "@/shared/utils/cn";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  suffix?: React.ReactNode;
}

export function AuthInput({
  label,
  error,
  className,
  type = "text",
  showPasswordToggle = false,
  suffix,
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm mb-1 text-gray-600">{label}</label>
      )}
      <div className="relative">
        <input
          type={inputType}
          className={cn(
            "w-full px-3 py-2.5 border border-gray-300 rounded-[12px] bg-[#F3F4F7] text-sm focus:outline-none focus:ring-1 focus:ring-blue",
            error && "border-[#ff272c] focus:ring-[#ff272c]",
            (suffix || showPasswordToggle) && "pr-10",
            suffix && showPasswordToggle && "pr-16",
            className
          )}
          {...props}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {suffix && <span className="flex items-center">{suffix}</span>}
          {showPasswordToggle && (
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-[#ff272c] text-xs mt-1">{error}</p>}
    </div>
  );
}
