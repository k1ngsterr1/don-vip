"use client";

import { cn } from "@/shared/utils/cn";
import { useRef, useState, useEffect } from "react";
import type React from "react";

interface VerificationCodeInputProps {
  code: string[];
  setCode: (code: string[]) => void;
  isDisabled?: boolean;
  onError?: (error: string | null) => void;
  locale?: string;
  digitLabel?: string;
  length?: number;
  className?: string;
  allowLetters?: boolean;
}

export function VerificationCodeInput({
  code,
  setCode,
  isDisabled = false,
  onError,
  locale = "en",
  digitLabel = "Verification code digit",
  length = 5,
  className,
  allowLetters = true,
}: VerificationCodeInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(length).fill(null)
  );
  const [isFocused, setIsFocused] = useState<boolean[]>(
    Array(length).fill(false)
  );

  // Initialize code array if needed
  useEffect(() => {
    if (!code || code.length !== length) {
      setCode(Array(length).fill(""));
    }
  }, [code, length, setCode]);

  const handleInputChange = (index: number, value: string) => {
    // Allow numbers and letters if allowLetters is true, otherwise only numbers
    const regex = allowLetters ? /^[a-zA-Z0-9]*$/ : /^\d*$/;
    if (!regex.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(0, 1); // Only take the first character
    setCode(newCode);
    onError?.(null);

    // Auto-focus next input if current input is filled
    if (value && index < length - 1) {
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

    // Arrow key navigation
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }

    // Handle paste event
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        // Filter text based on allowLetters setting
        const pattern = allowLetters ? /[^a-zA-Z0-9]/g : /\D/g;
        const chars = text.replace(pattern, "").split("").slice(0, length);
        const newCode = [...code];

        chars.forEach((char, i) => {
          if (i < length) newCode[i] = char;
        });

        setCode(newCode);

        // Focus the appropriate input after paste
        if (chars.length < length) {
          inputRefs.current[chars.length]?.focus();
        } else {
          inputRefs.current[length - 1]?.focus();
        }
      });
    }
  };

  const handleFocus = (index: number) => {
    const newFocused = [...isFocused];
    newFocused[index] = true;
    setIsFocused(newFocused);
  };

  const handleBlur = (index: number) => {
    const newFocused = [...isFocused];
    newFocused[index] = false;
    setIsFocused(newFocused);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Filter pasted data based on allowLetters setting
    const pattern = allowLetters ? /[^a-zA-Z0-9]/g : /\D/g;
    const chars = pastedData.replace(pattern, "").split("").slice(0, length);

    if (chars.length > 0) {
      const newCode = [...code];

      chars.forEach((char, i) => {
        if (i < length) newCode[i] = char;
      });

      setCode(newCode);

      // Focus the appropriate input after paste
      if (chars.length < length) {
        inputRefs.current[chars.length]?.focus();
      } else {
        inputRefs.current[length - 1]?.focus();
      }
    }
  };

  return (
    <div
      className={cn("flex justify-center gap-2 md:gap-3", className)}
      role="group"
      aria-labelledby="verification-code-label"
    >
      <span id="verification-code-label" className="sr-only">
        Enter your verification code
      </span>
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="relative">
          <input
            ref={(el: any) => (inputRefs.current[index] = el)}
            type="text"
            inputMode={allowLetters ? "text" : "numeric"}
            pattern={allowLetters ? undefined : "[0-9]*"}
            maxLength={1}
            value={code[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            onBlur={() => handleBlur(index)}
            onPaste={handlePaste}
            className={cn(
              "w-12 h-14 text-center text-xl font-medium border rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
              "transition-all duration-150",
              "disabled:bg-muted disabled:cursor-not-allowed",
              code[index] ? "border-primary/50 bg-primary/5" : "border-input",
              isFocused[index] ? "border-primary ring-1 ring-primary" : ""
            )}
            disabled={isDisabled}
            aria-label={`${digitLabel} ${index + 1} of ${length}`}
            autoComplete={index === 0 ? "one-time-code" : "off"}
          />
        </div>
      ))}
    </div>
  );
}
