"use client";
import { useTranslations } from "next-intl";
import type React from "react";

import { AuthInput } from "@/shared/ui/auth-input/auth-input";
import { Button } from "@/shared/ui/button/button";
import { SocialAuth } from "@/shared/ui/social-input/social-input";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Info, Mail, Phone } from "lucide-react";
import { AuthLoadingOverlay } from "@/shared/ui/auth-loading/auth-loading";
import { useRegister } from "@/entities/auth/hooks/use-auth";
import { PasswordStrength } from "@/shared/ui/password-strength/password-strength";

export function RegisterForm() {
  const i18n = useTranslations("register-form_auth.registerForm");
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
  const router = useRouter();

  // Get register mutation from our auth API hooks
  const {
    mutate: register,
    isPending: isLoading,
    error: registerError,
  } = useRegister();

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

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    // Require at least 3 of the 5 criteria
    const criteriaMet = [
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    ].filter(Boolean).length;
    return criteriaMet >= 3;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      identifier: !identifier
        ? i18n("errors.identifierRequired") || "Email or phone is required"
        : !validateIdentifier(identifier, identifierType)
        ? identifierType === "email"
          ? i18n("errors.emailInvalid") || "Please enter a valid email"
          : i18n("errors.phoneInvalid") || "Please enter a valid phone number"
        : undefined,
      password: !password
        ? i18n("errors.passwordRequired") || "Password is required"
        : !validatePassword(password)
        ? i18n("errors.passwordWeak") ||
          "Password is too weak. Please make it stronger."
        : undefined,
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    // Call register mutation with user data
    register(
      {
        identifier,
        password,
      },
      {
        onSuccess: () => {
          // Set redirecting state to show loading overlay
          setIsRedirecting(true);

          // Redirect to success page or login
          setTimeout(() => {
            router.push("/");
          }, 800); // Small delay for a smoother transition
        },
        onError: (error: any) => {
          // Handle registration errors
          setErrors({
            identifier:
              error.response?.data?.message ||
              "Registration failed. Please try again.",
          });
        },
      }
    );
  };

  const showLoadingOverlay = isLoading || isRedirecting;
  const loadingState = isRedirecting ? "redirecting" : "processing";

  return (
    <div className="max-w-md mx-auto relative">
      <AuthLoadingOverlay
        isVisible={showLoadingOverlay}
        state={loadingState}
        message={
          isRedirecting
            ? i18n("redirectingText") || "Redirecting..."
            : i18n("processingText") || "Creating your account..."
        }
      />
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <AuthInput
            type={identifierType === "phone" ? "tel" : "email"}
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
            disabled={showLoadingOverlay}
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
              // Show password hints when user starts typing
              if (e.target.value && !showPasswordHints) {
                setShowPasswordHints(true);
              }
            }}
            showPasswordToggle
            error={errors.password}
            disabled={showLoadingOverlay}
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

          {/* Password strength indicator */}
          {showPasswordHints && <PasswordStrength password={password} />}
        </div>

        {registerError && !showLoadingOverlay && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {registerError instanceof Error
              ? registerError.message
              : "Registration failed. Please try again."}
          </div>
        )}
        <div className="w-full flex justify-end">
          <Link
            className="text-[13px] text-right text-black"
            href="/auth/forgot-password"
            tabIndex={showLoadingOverlay ? -1 : 0}
          >
            {i18n("forgotPassword") || "Forgot password?"}
          </Link>
        </div>
        <Button
          type="submit"
          className={`w-full rounded-full text-white py-3 md:py-4 text-sm md:text-base ${
            isFormFilled && !showLoadingOverlay
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-[#AAAAAB] hover:bg-[#AAAAAB]/90"
          }`}
          disabled={!isFormFilled || showLoadingOverlay}
        >
          {showLoadingOverlay ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isRedirecting
                ? i18n("redirectingText") || "Redirecting..."
                : i18n("processingText") || "Creating account..."}
            </span>
          ) : (
            i18n("submitButton") || "Register"
          )}
        </Button>
      </form>

      <SocialAuth />

      <div className="mt-6 text-center text-xs text-gray-500">
        <p>
          {i18n("privacyText") || "By registering, you agree to our"}{" "}
          <Link href="#" className="text-black">
            {i18n("privacyLink") || "Privacy Policy"}
          </Link>
        </p>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm">
          {i18n("haveAccountText") || "Already have an account?"}{" "}
          <Link href="/auth/login" className="text-blue-600 font-medium">
            {i18n("loginLink") || "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
}
