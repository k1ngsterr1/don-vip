"use client";

import { useRef } from "react";
import type React from "react";

interface VerificationCodeInputProps {
  code: string[];
  setCode: (code: string[]) => void;
  isDisabled: boolean;
  onError: (error: string | null) => void;
  locale: string;
  digitLabel: string;
}

export function VerificationCodeInput({
  code,
  setCode,
  isDisabled,
  onError,
  locale,
  digitLabel,
}: VerificationCodeInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(5).fill(null));

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(0, 1); // Only take the first character
    setCode(newCode);
    onError(null);

    // Auto-focus next input if current input is filled
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste event
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").split("").slice(0, 5);
        const newCode = [...code];

        digits.forEach((digit, i) => {
          if (i < 5) newCode[i] = digit;
        });

        setCode(newCode);

        // Focus the appropriate input after paste
        if (digits.length < 5) {
          inputRefs.current[digits.length]?.focus();
        } else {
          inputRefs.current[4]?.focus();
        }
      });
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el: any) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-10 text-center text-lg border border-blue rounded-md focus:outline-none focus:ring-1 focus:ring-blue transition-all disabled:bg-gray-100"
          disabled={isDisabled}
          aria-label={`${digitLabel || "Verification code digit"} ${index + 1}`}
        />
      ))}
    </div>
  );
}
