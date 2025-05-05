"use client";
import { useTranslations } from "next-intl";
import type React from "react";

import Link from "next/link";
import { useState } from "react";
import { AuthInput } from "@/shared/ui/auth-input/auth-input";
import { Button } from "@/shared/ui/button/button";
import { SocialAuth } from "@/shared/ui/social-input/social-input";
import { useSearchParams, useRouter } from "next/navigation";
import { useLogin } from "@/entities/auth/hooks/mutations/use-auth.mutation";
import { Loader2 } from "lucide-react";
import { AuthLoadingOverlay } from "@/shared/ui/auth-loading/auth-loading";

export function LoginForm() {
  const i18n = useTranslations("login-form_auth.loginForm");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isRedirecting, setIsRedirecting] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get login mutation from our auth API hooks
  const { mutate: login, isPending: isLoading, error: loginError } = useLogin();

  // Check if we have a return URL to redirect back to after login
  const returnUrl = searchParams.get("returnUrl");

  const isFormFilled = email.trim() !== "" && password.trim() !== "";

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = i18n("errors.emailRequired");
    } else if (!validateEmail(email)) {
      newErrors.email = i18n("errors.emailInvalid");
    }

    if (!password.trim()) {
      newErrors.password = i18n("errors.passwordRequired");
    } else if (password.length < 6) {
      newErrors.password = i18n("errors.passwordLength");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call login mutation with credentials
    login(
      { identifier: email, password },
      {
        onSuccess: () => {
          // Set redirecting state to show loading overlay
          setIsRedirecting(true);

          // Redirect to return URL if available, or to profile page
          setTimeout(() => {
            if (returnUrl) {
              router.push(decodeURIComponent(returnUrl));
            } else {
              router.push("/profile");
            }
          }, 800); // Small delay for a smoother transition
        },
        onError: (error: any) => {
          // Handle login errors
          setErrors({
            email: error.response?.data?.message || i18n("errorMessage"),
          });
        },
      }
    );
  };

  // Show loading overlay when loading or redirecting
  const showLoadingOverlay = isLoading || isRedirecting;
  const loadingState = isRedirecting ? "redirecting" : "loading";

  return (
    <div className="max-w-md mx-auto relative">
      {/* Reusable loading overlay */}
      <AuthLoadingOverlay
        isVisible={showLoadingOverlay}
        state={loadingState}
        message={isRedirecting ? i18n("redirectingText") : i18n("loadingText")}
      />

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <AuthInput
          type="email"
          placeholder={i18n("emailPlaceholder")}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email)
              setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
          disabled={isLoading || isRedirecting}
          aria-label={i18n("ariaLabels.email")}
        />

        <div className="space-y-1">
          <AuthInput
            type="password"
            placeholder={i18n("passwordPlaceholder")}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            showPasswordToggle
            error={errors.password}
            disabled={isLoading || isRedirecting}
            aria-label={i18n("ariaLabels.password")}
          />
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-xs md:text-sm text-blue hover:underline"
              aria-label={i18n("ariaLabels.forgotPassword")}
            >
              {i18n("forgotPassword")}
            </Link>
          </div>
        </div>

        {loginError && !showLoadingOverlay && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {loginError instanceof Error
              ? loginError.message
              : i18n("errorMessage")}
          </div>
        )}

        <Button
          type="submit"
          className={`w-full rounded-full text-white py-3 md:py-4 text-sm md:text-base ${
            isFormFilled && !showLoadingOverlay
              ? "bg-blue hover:bg-blue/90"
              : "bg-[#AAAAAB] hover:bg-[#AAAAAB]/90"
          }`}
          disabled={!isFormFilled || showLoadingOverlay}
          aria-label={i18n("ariaLabels.submit")}
        >
          {showLoadingOverlay ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isRedirecting
                ? i18n("redirectingText") || "Redirecting..."
                : i18n("loadingText") || "Logging in..."}
            </span>
          ) : (
            i18n("submitButton")
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs md:text-sm text-gray-500">
        <p>
          {i18n("privacyText")}{" "}
          <Link href="#" className="text-black hover:underline">
            {i18n("privacyLink")}
          </Link>
        </p>
      </div>

      <SocialAuth />

      <div className="mt-8 text-center">
        <p className="text-sm md:text-base text-[#929294]">
          {i18n("noAccountText")}{" "}
          <Link
            href="/auth/register"
            className="text-black font-medium hover:underline"
          >
            {i18n("registerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
