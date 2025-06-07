"use client";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import type React from "react";

import { useState, useEffect } from "react";
import { AuthInput } from "@/shared/ui/auth-input/auth-input";
import { Button } from "@/shared/ui/button/button";
import { SocialAuth } from "@/shared/ui/social-input/social-input";
import { useSearchParams } from "next/navigation";
import { Loader2, Info, Mail } from "lucide-react";
import { AuthLoadingOverlay } from "@/shared/ui/auth-loading/auth-loading";
import { useLogin } from "@/entities/auth/hooks/use-auth";
import { PasswordStrength } from "@/shared/ui/password-strength/password-strength";
import { Link } from "@/i18n/navigation";
import { PhoneInput } from "@/shared/ui/phone-input/phone-input"; // Corrected path based on your file
import { useRouter } from "@/i18n/routing";
import { isValidPhoneNumber } from "react-phone-number-input";

// Enhanced error translations for all possible input errors
const errorTranslations: Record<string, Record<string, string>> = {
  en: {
    // Form validation errors
    "Email or phone is required": "Email or phone is required",
    "Invalid email format": "Invalid email format",
    "Invalid phone number": "Invalid phone number (e.g. +1234567890)",
    "Password is required": "Password is required",
    "Password is too weak": "Password is too weak",

    // API errors
    "Invalid credentials": "Invalid credentials",
    "User not found": "User not found",
    "Account is locked": "Account is locked",
    "Too many login attempts": "Too many login attempts",
    "Invalid email or password": "Invalid email or password",
    "Login failed. Please try again later":
      "Login failed. Please try again later",
    "Account not found": "Account not found",
    "Too many login attempts, please try again later":
      "Too many login attempts, please try again later",

    // HTTP status code errors
    "status code 400": "Invalid email or password",
    "status code 401": "Invalid credentials",
    "status code 403": "Account is locked",
    "status code 404": "Account not found",
    "status code 429": "Too many login attempts, please try again later",
    "status code 500": "Login failed. Please try again later",
  },
  ru: {
    // Form validation errors
    "Email or phone is required": "Email или телефон обязательны",
    "Invalid email format": "Неверный формат email",
    "Invalid phone number": "Неверный номер телефона (например +71234567890)",
    "Password is required": "Требуется пароль",
    "Password is too weak": "Пароль слишком слабый",

    // API errors
    "Invalid credentials": "Неверные учетные данные",
    "User not found": "Пользователь не найден",
    "Account is locked": "Аккаунт заблокирован",
    "Too many login attempts": "Слишком много попыток входа",
    "Invalid email or password": "Неверный email или пароль",
    "Login failed. Please try again later":
      "Ошибка входа. Пожалуйста, попробуйте позже",
    "Account not found": "Аккаунт не найден",
    "Too many login attempts, please try again later":
      "Слишком много попыток входа, пожалуйста, попробуйте позже",

    // HTTP status code errors
    "status code 400": "Неверный email или пароль",
    "status code 401": "Неверные учетные данные",
    "status code 403": "Аккаунт заблокирован",
    "status code 404": "Аккаунт не найден",
    "status code 429":
      "Слишком много попыток входа, пожалуйста, попробуйте позже",
    "status code 500": "Ошибка входа. Пожалуйста, попробуйте позже",
  },
};

// Translate any error message based on current locale
function translateError(message: string, locale: string): string {
  const translations = errorTranslations[locale === "ru" ? "ru" : "en"];

  // Check for direct translation
  if (translations[message]) {
    return translations[message];
  }

  // Check for status code errors
  for (const key of Object.keys(translations)) {
    if (message.includes(key)) {
      return translations[key];
    }
  }

  // Return original message if no translation found
  return message;
}

function getHumanReadableError(error: string, locale = "en"): string {
  if (error.includes("status code 400")) {
    return translateError("status code 400", locale);
  }
  if (error.includes("status code 401")) {
    return translateError("status code 401", locale);
  }
  if (error.includes("status code 403")) {
    return translateError("status code 403", locale);
  }
  if (error.includes("status code 404")) {
    return translateError("status code 404", locale);
  }
  if (error.includes("status code 429")) {
    return translateError("status code 429", locale);
  }
  if (error.includes("status code")) {
    return translateError("status code 500", locale);
  }
  return translateError(error, locale);
}

export function LoginForm() {
  const i18n = useTranslations("login-form_auth.loginForm");
  const locale = useLocale();
  const [identifier, setIdentifier] = useState<string>("");
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

  const { mutate: login, isPending: isLoading, error: loginError } = useLogin();
  const returnUrl = searchParams.get("returnUrl");
  const isFormFilled = identifier.trim() !== "" && password.trim() !== "";

  useEffect(() => {
    const input = identifier.trim();
    if (input) {
      if (input.includes("@")) {
        setIdentifierType("email");
      } else if (
        input.startsWith("+") ||
        input.replace(/[^0-9]/g, "").length > input.length / 2
      ) {
        setIdentifierType("phone");
      }
    }
  }, [identifier]);

  const validateLocalIdentifier = (value: string, type: "email" | "phone") => {
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    } else {
      return isValidPhoneNumber(value);
    }
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdentifier(value);

    if (errors.identifier) {
      setErrors((prev) => ({ ...prev, identifier: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      newErrors.identifier = translateError(
        "Email or phone is required",
        locale
      );
    } else if (!validateLocalIdentifier(identifier, identifierType)) {
      newErrors.identifier = translateError(
        identifierType === "email"
          ? "Invalid email format"
          : "Invalid phone number",
        locale
      );
    }

    if (!password.trim()) {
      newErrors.password = translateError("Password is required", locale);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    login(
      { identifier: identifier.trim(), password },
      {
        onSuccess: (data: any) => {
          setIsRedirecting(true);
          setTimeout(() => {
            if (returnUrl) {
              router.push(decodeURIComponent(returnUrl) as any);
            } else {
              router.push(`/profile/${data.id}` as any);
            }
          }, 800);
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message ||
            (error.message
              ? getHumanReadableError(error.message, locale)
              : translateError("Invalid email or password", locale));
          setErrors({ identifier: errorMessage });
        },
      }
    );
  };

  const showLoadingOverlay = isLoading || isRedirecting;
  const loadingState = isRedirecting ? "redirecting" : "loading";

  const handlePhoneInputChange = (newValue?: string) => {
    let proposedValue = newValue;

    // 1. Handle undefined (input cleared by library) -> default to "+"
    if (proposedValue === undefined) {
      proposedValue = "+";
    }

    // 2. Strict check on raw digit count.
    const digits = (proposedValue.match(/\d/g) || []).join("");
    const MAX_DIGITS = 15; // E.164 standard

    if (digits.length > MAX_DIGITS) {
      // If the number of digits is too high, do not update the state.
      // The `maxLength` on the input field provides the UI stop.
      return;
    }

    // 3. Update state if the value is valid so far and has changed.
    if (proposedValue !== identifier) {
      setIdentifier(proposedValue);
      if (errors.identifier) {
        setErrors((prev) => ({ ...prev, identifier: undefined }));
      }
    }
  };

  return (
    <div className="max-w-md mx-auto relative">
      <AuthLoadingOverlay isVisible={showLoadingOverlay} state={loadingState} />
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <div className="relative">
          {identifierType === "email" ? (
            <AuthInput
              type="email"
              placeholder={i18n("emailPlaceholder") || "Email address"}
              value={identifier}
              onChange={handleIdentifierChange}
              disabled={showLoadingOverlay}
              suffix={<Mail size={16} className="text-gray-400" />}
            />
          ) : (
            <PhoneInput
              placeholder={i18n("phonePlaceholder") || "Phone number"}
              value={identifier}
              onChange={handlePhoneInputChange}
              disabled={showLoadingOverlay}
              error={errors.identifier}
            />
          )}
          <div className="mt-1 text-xs text-gray-500 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setIdentifierType(
                  identifierType === "email" ? "phone" : "email"
                );
                setIdentifier(""); // Clear identifier on type switch
                setErrors({});
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

        {(errors.identifier || errors.password) && !showLoadingOverlay && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {errors.identifier || errors.password}
          </div>
        )}
        {loginError &&
          !errors.identifier &&
          !errors.password &&
          !showLoadingOverlay && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {loginError instanceof Error
                ? getHumanReadableError(loginError.message, locale)
                : translateError("Invalid email or password", locale)}
            </div>
          )}

        <Button
          type="submit"
          className={`w-full rounded-full text-white py-3 md:py-4 text-sm md:text-base ${
            isFormFilled &&
            !showLoadingOverlay &&
            validateLocalIdentifier(identifier, identifierType)
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
