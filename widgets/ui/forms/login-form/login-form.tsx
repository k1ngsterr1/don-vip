"use client";
import { useTranslations } from "next-intl";
import type React from "react";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AuthInput } from "@/shared/ui/auth-input/auth-input";
import { Button } from "@/shared/ui/button/button";
import { SocialAuth } from "@/shared/ui/social-input/social-input";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Info, Mail, Phone } from "lucide-react";
import { AuthLoadingOverlay } from "@/shared/ui/auth-loading/auth-loading";
import { useLogin } from "@/entities/auth/hooks/use-auth";
import { PasswordStrength } from "@/shared/ui/password-strength/password-strength";

export function LoginForm() {
  const i18n = useTranslations("login-form_auth.loginForm");
  const [identifier, setIdentifier] = useState("");
  const [identifierType, setIdentifierType] = useState<"email" | "phone">(
    "email"
  );
  const [password, setPassword] = useState("");
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});
  const [isRedirecting, setIsRedirecting] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get login mutation from our auth API hooks
  const { mutate: login, isPending: isLoading, error: loginError } = useLogin();

  // Check if we have a return URL to redirect back to after login
  const returnUrl = searchParams.get("returnUrl");

  const isFormFilled = identifier.trim() !== "" && password.trim() !== "";

  // Detect if input is email or phone number
  useEffect(() => {
    const input = identifier.trim();
    if (input) {
      // Check if input contains @ symbol (likely an email)
      if (input.includes("@")) {
        setIdentifierType("email");
      }
      // Check if input is mostly numeric (likely a phone number)
      else if (input.replace(/[^0-9]/g, "").length > input.length / 2) {
        setIdentifierType("phone");
      }
    }
  }, [identifier]);

  const validateIdentifier = (value: string, type: "email" | "phone") => {
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    } else {
      // Phone validation - check if it has at least 10 digits
      const digitsOnly = value.replace(/\D/g, "");
      return digitsOnly.length >= 10;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      newErrors.identifier =
        i18n("errors.identifierRequired") || "Email or phone is required";
    } else if (!validateIdentifier(identifier, identifierType)) {
      newErrors.identifier =
        identifierType === "email"
          ? i18n("errors.emailInvalid") || "Invalid email format"
          : i18n("errors.phoneInvalid") || "Invalid phone number";
    }

    if (!password.trim()) {
      newErrors.password =
        i18n("errors.passwordRequired") || "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call login mutation with credentials
    login(
      { identifier, password },
      {
        onSuccess: (data: any) => {
          // Set redirecting state to show loading overlay
          setIsRedirecting(true);

          // Redirect to return URL if available, or to profile page
          setTimeout(() => {
            if (returnUrl) {
              router.push(decodeURIComponent(returnUrl));
            } else {
              router.push(`/profile/${data.id}`);
            }
          }, 800); // Small delay for a smoother transition
        },
        onError: (error: any) => {
          // Handle login errors
          setErrors({
            identifier:
              error.response?.data?.message ||
              i18n("errorMessage") ||
              "Login failed",
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
        <div className="relative">
          <AuthInput
            type={identifierType === "phone" ? "tel" : "email"}
            name="identifier"
            placeholder={
              identifierType === "email"
                ? i18n("emailPlaceholder") || "Email address"
                : i18n("phonePlaceholder") || "Phone number"
            }
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (errors.identifier)
                setErrors((prev) => ({ ...prev, identifier: undefined }));
            }}
            error={errors.identifier}
            disabled={isLoading || isRedirecting}
            aria-label={
              identifierType === "email"
                ? i18n("ariaLabels.email") || "Email"
                : i18n("ariaLabels.phone") || "Phone"
            }
            isPhoneMask={identifierType === "phone"}
            suffix={
              <span className="text-gray-400">
                {identifierType === "email" ? (
                  <Mail size={16} />
                ) : (
                  <Phone size={16} />
                )}
              </span>
            }
          />
          <div className="mt-1 text-xs text-gray-500 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setIdentifierType(
                  identifierType === "email" ? "phone" : "email"
                );
                setIdentifier("");
              }}
              className="text-blue hover:underline"
            >
              {identifierType === "email"
                ? i18n("usePhoneInstead") || "Use phone instead"
                : i18n("useEmailInstead") || "Use email instead"}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <AuthInput
            type="password"
            placeholder={i18n("passwordPlaceholder") || "Password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            showPasswordToggle
            error={errors.password}
            disabled={isLoading || isRedirecting}
            aria-label={i18n("ariaLabels.password") || "Password"}
            suffix={
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowPasswordHints(!showPasswordHints)}
                aria-label="Toggle password hints"
              >
                <Info className="h-4 w-4" />
              </button>
            }
          />

          {/* Show password hints when button is clicked */}
          {showPasswordHints && <PasswordStrength password={password} />}

          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-xs md:text-sm text-blue hover:underline"
              aria-label={
                i18n("ariaLabels.forgotPassword") || "Forgot password"
              }
            >
              {i18n("forgotPassword") || "Forgot password?"}
            </Link>
          </div>
        </div>

        {loginError && !showLoadingOverlay && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {loginError instanceof Error
              ? loginError.message
              : i18n("errorMessage") || "Login failed. Please try again."}
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
          aria-label={i18n("ariaLabels.submit") || "Login"}
        >
          {showLoadingOverlay ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isRedirecting
                ? i18n("redirectingText") || "Redirecting..."
                : i18n("loadingText") || "Logging in..."}
            </span>
          ) : (
            i18n("submitButton") || "Login"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs md:text-sm text-gray-500">
        <p>
          {i18n("privacyText") || "By continuing, you agree to our"}{" "}
          <Link href="/privacy-policy" className="text-black hover:underline">
            {i18n("privacyLink") || "Privacy Policy"}
          </Link>
        </p>
      </div>

      <SocialAuth />

      <div className="mt-8 text-center">
        <p className="text-sm md:text-base text-[#929294]">
          {i18n("noAccountText") || "Don't have an account?"}{" "}
          <Link
            href="/auth/register"
            className="text-black font-medium hover:underline"
          >
            {i18n("registerLink") || "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
}
