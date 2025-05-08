"use client";

import type React from "react";

import { cn } from "@/shared/utils/cn";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  suffix?: React.ReactNode;
  isPhoneMask?: boolean;
}

export function AuthInput({
  label,
  error,
  className,
  type = "text",
  showPasswordToggle = false,
  suffix,
  isPhoneMask = false,
  value,
  onChange,
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  // Format phone number as (XXX) XXX-XXXX
  const formatPhoneNumber = (value: string) => {
    if (!value) return "";

    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, "");

    // Apply the mask based on the length of the number
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
      )}-${phoneNumber.slice(6, 10)}`;
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (isPhoneMask) {
      // For phone mask, format the value
      const formattedValue = formatPhoneNumber(newValue);
      setInputValue(formattedValue);

      // Create a synthetic event to pass to the original onChange
      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: formattedValue,
          },
        };
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      }
    } else {
      // For regular inputs, just update the value normally
      setInputValue(newValue);
      if (onChange) {
        onChange(e);
      }
    }
  };

  // Sync with external value changes
  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(
        isPhoneMask ? formatPhoneNumber(value as string) : (value as string)
      );
    }
  }, [value, isPhoneMask]);

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
          value={inputValue}
          onChange={handleInputChange}
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
