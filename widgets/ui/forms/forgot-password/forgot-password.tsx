"use client";

import type React from "react";
import { useTranslations } from "next-intl";
import { AuthInput } from "@/shared/ui/auth-input/auth-input";
import { Button } from "@/shared/ui/button/button";
import { SocialAuth } from "@/shared/ui/social-input/social-input";
import { useState, useEffect } from "react";
import { Loader2, Mail, Phone } from "lucide-react";
import { useChangePassword } from "@/entities/auth/hooks/use-auth";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/routing";
import { PhoneInputWithCountry } from "@/shared/ui/phone-input/phone-input";

const errorTranslations: Record<string, Record<string, string>> = {
  en: {
    // Form validation errors
    "Email or phone is required": "Email or phone is required",
    "Invalid email format": "Please enter a valid email address",
    "Invalid phone number": "Please enter a valid phone number",

    // API errors
    "User not found": "No account found with this email or phone number",
    "Account not found": "No account found with this email or phone number",
    "Email not found": "No account found with this email address",
    "Phone not found": "No account found with this phone number",
    "Too many requests":
      "Too many password reset attempts. Please try again later",
    "Rate limit exceeded":
      "Too many password reset attempts. Please try again later",
    "Password reset failed": "Password reset failed. Please try again later",
    "Invalid email or phone": "Please enter a valid email or phone number",
    "Service temporarily unavailable":
      "Service temporarily unavailable. Please try again later",

    // HTTP status code errors
    "status code 400": "Please enter a valid email or phone number",
    "status code 401": "Invalid request. Please try again",
    "status code 403":
      "Password reset is temporarily disabled for this account",
    "status code 404": "No account found with this email or phone number",
    "status code 422": "Please enter a valid email or phone number",
    "status code 429":
      "Too many password reset attempts. Please try again later",
    "status code 500": "Password reset failed. Please try again later",
    "status code 502":
      "Service temporarily unavailable. Please try again later",
    "status code 503":
      "Service temporarily unavailable. Please try again later",
  },
  ru: {
    // Form validation errors
    "Email or phone is required": "Email или телефон обязательны",
    "Invalid email format": "Пожалуйста, введите корректный email адрес",
    "Invalid phone number": "Пожалуйста, введите ��орректный номер телефона",

    // API errors
    "User not found": "Аккаунт с таким email или телефоном не найден",
    "Account not found": "Аккаунт с таким email или телефоном не найден",
    "Email not found": "Аккаунт с таким email адресом не найден",
    "Phone not found": "Аккаунт с таким номером телефона не найден",
    "Too many requests":
      "Слишком много попыток сброса пароля. Попробуйте позже",
    "Rate limit exceeded":
      "Слишком много попыток сброса пароля. Попробуйте позже",
    "Password reset failed":
      "Ошибка сброса пароля. Пожалуйста, попробуйте позже",
    "Invalid email or phone":
      "Пожалуйста, введите корректный email или телефон",
    "Service temporarily unavailable":
      "Сервис временно недоступен. Попробуйте позже",

    // HTTP status code errors
    "status code 400": "Пожалуйста, введите корректный email или телефон",
    "status code 401": "Неверный запрос. Пожалуйста, попробуйте снова",
    "status code 403": "Сброс пароля временно отключен для этого аккаунта",
    "status code 404": "Аккаунт с таким email или телефоном не найден",
    "status code 422": "Пожалуйста, введите корректный email или телефон",
    "status code 429": "Слишком много попыток сброса пароля. Попробуйте позже",
    "status code 500": "Ошибка сброса пароля. Пожалуйста, попробуйте позже",
    "status code 502": "Сервис временно недоступен. Попробуйте позже",
    "status code 503": "Сервис временно недоступен. Попробуйте позже",
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
  if (error.includes("status code 422")) {
    return translateError("status code 422", locale);
  }
  if (error.includes("status code 429")) {
    return translateError("status code 429", locale);
  }
  if (error.includes("status code 502")) {
    return translateError("status code 502", locale);
  }
  if (error.includes("status code 503")) {
    return translateError("status code 503", locale);
  }
  if (error.includes("status code")) {
    return translateError("status code 500", locale);
  }
  return translateError(error, locale);
}

// Clean phone number to format +77759932587
function cleanPhoneNumber(phone: string): string {
  // Remove all non-digit characters except the + sign at the beginning
  return phone.replace(/[^\d+]/g, "");
}

export function ForgotPasswordForm() {
  const router = useRouter();
  const t = useTranslations("forgot_auth.forgotPassword");
  const [identifier, setIdentifier] = useState("");
  const [identifierType, setIdentifierType] = useState<"email" | "phone">(
    "email"
  );
  const [error, setError] = useState("");
  const locale = useLocale();

  const { mutate: changePassword, isPending: isLoading } = useChangePassword();

  const isFormFilled = identifier.trim() !== "";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setError(translateError("Email or phone is required", locale));
      return;
    }

    if (!validateIdentifier(identifier, identifierType)) {
      setError(
        translateError(
          identifierType === "email"
            ? "Invalid email format"
            : "Invalid phone number",
          locale
        )
      );
      return;
    }

    // Format the identifier based on type
    let formattedIdentifier = identifier.trim();

    if (identifierType === "phone") {
      // Clean the phone number to remove all formatting
      formattedIdentifier = cleanPhoneNumber(formattedIdentifier);

      // Ensure it starts with +7
      if (formattedIdentifier.startsWith("+7")) {
        // Already in correct format
      } else if (formattedIdentifier.startsWith("7")) {
        formattedIdentifier = `+${formattedIdentifier}`;
      } else if (formattedIdentifier.length === 10) {
        // Assuming 10-digit number without country code
        formattedIdentifier = `+7${formattedIdentifier}`;
      } else {
        setError(translateError("Invalid phone number", locale));
        return;
      }
    }

    // Store the payload based on identifier type
    const payload =
      identifierType === "email"
        ? { email: formattedIdentifier, lang: locale }
        : { phone: formattedIdentifier, lang: locale };

    changePassword(payload, {
      onSuccess: () => {
        // Store the identifier for the success page
        sessionStorage.setItem(
          identifierType === "email"
            ? "resetPasswordEmail"
            : "resetPasswordPhone",
          formattedIdentifier
        );
        if (identifierType === "phone") {
          router.push(`/auth/forgot-password/code` as any);
        } else {
          router.push(`/auth/forgot-password/code` as any);
        }
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message;
        let errorMessage = "";

        if (Array.isArray(message)) {
          // Handle array of validation errors
          const firstError = message[0];
          const constraints = firstError?.constraints;
          const firstConstraintMsg =
            constraints && Object.values(constraints)[0];

          errorMessage = firstConstraintMsg || "Invalid request";
        } else {
          // Handle single error message or HTTP status codes
          errorMessage =
            message ||
            (error.message
              ? getHumanReadableError(error.message, locale)
              : "Password reset failed");
        }

        setError(translateError(errorMessage, locale));
      },
    });
  };

  return (
    <div className="max-w-md mx-auto md:bg-white md:rounded-lg md:shadow-sm md:border md:border-gray-100 md:p-8">
      <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 md:text-center">
        {t("description")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="relative">
          {identifierType === "email" ? (
            <AuthInput
              type="email"
              placeholder={t("email.placeholder")}
              label={t("email.label")}
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) setError("");
              }}
              disabled={isLoading}
              suffix={<Mail size={16} className="text-gray-400" />}
            />
          ) : (
            <PhoneInputWithCountry
              value={identifier}
              onChange={(val) => {
                setIdentifier(val || "");
                if (error) setError("");
              }}
              placeholder={t("phone.placeholder") || "Phone number"}
              error={error}
            />
          )}
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
                ? t("usePhoneInstead") || "Use phone instead"
                : t("useEmailInstead") || "Use email instead"}
            </button>
          </div>
        </div>

        {error && <p className="text-[#ff272c] text-xs md:text-sm">{error}</p>}

        <Button
          type="submit"
          className={`w-full rounded-full text-white py-3 md:py-4 text-sm md:text-base ${
            isFormFilled && !isLoading
              ? "bg-blue hover:bg-blue/90"
              : "bg-[#AAAAAB] hover:bg-[#AAAAAB]/90"
          }`}
          disabled={!isFormFilled || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("loading")}
            </span>
          ) : (
            t("submit")
          )}
        </Button>
      </form>

      <div className="mt-6 md:mt-8 text-center text-xs md:text-sm text-gray-500">
        <p>
          {t("privacy.text")}{" "}
          <a href="#" className="text-blue hover:underline">
            {t("privacy.link")}
          </a>
        </p>
      </div>

      <SocialAuth />

      <div className="mt-8 md:mt-10 text-center">
        <p className="text-sm md:text-base">
          {t("footer.question")}{" "}
          <Link
            href="/auth/login"
            className="text-blue font-medium hover:underline"
          >
            {t("footer.link")}
          </Link>
        </p>
      </div>
    </div>
  );
}
