"use client";

import type React from "react";

import { cn } from "@/shared/utils/cn";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

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
  const locale = useLocale();

  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  // Format phone number as +7 (XXX) XXX-XX-XX
  const formatPhoneNumber = (value: string) => {
    let phoneNumber = value.replace(/\D/g, "").replace(/^7|8/, "");
    phoneNumber = phoneNumber.substring(0, 10);

    if (phoneNumber.length === 0) return "+7";
    if (phoneNumber.length <= 3) return `+7 (${phoneNumber}`;
    if (phoneNumber.length <= 6)
      return `+7 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    if (phoneNumber.length <= 8)
      return `+7 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
      )}-${phoneNumber.slice(6)}`;
    return `+7 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 8)}-${phoneNumber.slice(8, 10)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cursorPos = e.target.selectionStart ?? raw.length;

    // Получаем только цифры
    const rawNumbers = raw.replace(/\D/g, "");

    if (!isPhoneMask) {
      setInputValue(raw);
      onChange?.(e);
      return;
    }

    // Подсчитываем, сколько цифр до курсора
    let digitsBeforeCursor = 0;
    for (let i = 0; i < cursorPos; i++) {
      if (/\d/.test(raw[i])) digitsBeforeCursor++;
    }

    // Форматируем номер
    const formatted = formatPhoneNumber(rawNumbers);

    // Устанавливаем новое значение
    setInputValue(formatted);

    // Передаём в onChange
    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formatted,
        },
      };
      onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }

    // Подождём и вернём курсор примерно в то же место
    setTimeout(() => {
      const input = e.target;
      // Считаем позицию курсора заново, пройдя formatted и найдя нужное число цифр
      let newPos = 0;
      let digitsCounted = 0;
      while (digitsCounted < digitsBeforeCursor && newPos < formatted.length) {
        if (/\d/.test(formatted[newPos])) {
          digitsCounted++;
        }
        newPos++;
      }
      input.setSelectionRange?.(newPos, newPos);
    }, 0);
  };

  // Sync with external value changes
  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(
        isPhoneMask ? formatPhoneNumber(value as string) : (value as string)
      );
    }
  }, [value, isPhoneMask, inputValue]);

  // Initialize phone input with +7 if empty
  useEffect(() => {
    if (isPhoneMask && (!inputValue || inputValue === "")) {
      setInputValue("+7");
    }
  }, [isPhoneMask, inputValue]);

  // Process error message to display in the correct language
  const getErrorMessage = (errorText: string) => {
    // If error already contains language prefixes like "EN:" or "RU:"
    if (errorText.includes("EN:") && errorText.includes("RU:")) {
      const parts = errorText.split("/");
      if (parts.length >= 2) {
        const enPart = parts[0].trim();
        const ruPart = parts[1].trim();
        return locale === "ru" ? ruPart : enPart;
      }
    }

    // If error is a simple string with no language markers
    return errorText;
  };

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
      {error && (
        <p className="text-[#ff272c] text-xs mt-1">{getErrorMessage(error)}</p>
      )}
    </div>
  );
}
