"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resendVerificationCode, verifyCode } from "../api/verification.api";
import { translateErrorMessage } from "@/shared/utils/error-translations";

export function useVerification(
  email: string,
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

  // Start cooldown timer for resend button
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
      await verifyCode(fullCode, email);
      setIsVerified(true);

      // Set redirecting state to show success overlay
      setTimeout(() => {
        setIsRedirecting(true);

        // Redirect to return URL if available, or to profile page
        // Redirect to return URL if available, or to /auth/success
        setTimeout(() => {
          if (returnUrl) {
            router.push(decodeURIComponent(returnUrl));
          } else {
            router.push("/auth/success");
          }
        }, 800);
      }, 1500);
    } catch (err: any) {
      const errorMessage = translateErrorMessage(err.message);

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    try {
      await resendVerificationCode(email);
      setResendCooldown(60); // 60 second cooldown
    } catch (err: any) {
      const errorMessage = translateErrorMessage(err.messagew);

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
