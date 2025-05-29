"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { translateErrorMessage } from "@/shared/utils/error-translations";
import { userApi } from "@/entities/user/auth/user-api";

export function useVerification(
  identifier: string,
  returnUrl: string | null,
  locale: string
) {
  const [code, setCode] = useState<string[]>(Array(5).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullCode = code.join("");

    if (fullCode.length !== 5) {
      setError(translateErrorMessage("Code is required"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await userApi.verify({
        identifier,
        code: fullCode,
      });

      setIsVerified(true);

      setTimeout(() => {
        setIsRedirecting(true);
        setTimeout(() => {
          if (returnUrl) {
            router.push(decodeURIComponent(returnUrl));
          } else {
            router.push("/auth/success");
          }
        }, 800);
      }, 1500);
    } catch (err: any) {
      const errorMessage = translateErrorMessage(
        err.message || "Verification failed"
      );
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    setError(null); // Clear previous errors before resending
    try {
      // Use userApi.resendVerificationCode instead of the imported function
      await userApi.resendVerificationCode({
        identifier,
        lang: locale as "ru" | "en", // Type assertion to match the expected type
      });
      setResendCooldown(60); // 60 second cooldown
    } catch (err: any) {
      const errorMessage = translateErrorMessage(
        err.message || "Failed to resend code"
      );
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    code,
    setCode,
    isLoading,
    isRedirecting,
    isVerified,
    error,
    setError,
    resendCooldown,
    handleSubmit,
    handleResendCode,
  };
}
