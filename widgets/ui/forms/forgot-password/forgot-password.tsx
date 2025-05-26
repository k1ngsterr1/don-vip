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

export function ForgotPasswordForm() {
  const router = useRouter();
  const t = useTranslations("forgot_auth.forgotPassword");
  const [identifier, setIdentifier] = useState("");
  const [identifierType, setIdentifierType] = useState<"email" | "phone">(
    "email"
  );
  const [error, setError] = useState("");
  const locale = useLocale(); // ⬅️ получаем текущий язык (например, "ru" или "en")

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
      setError(t("error.required"));
      return;
    }

    if (!validateIdentifier(identifier, identifierType)) {
      setError(
        identifierType === "email"
          ? t("error.invalidEmail")
          : t("error.invalidPhone")
      );
      return;
    }

    // Format the identifier based on type
    let formattedIdentifier = identifier.trim();
    if (identifierType === "phone") {
      // For phone numbers, extract only the digits
      const digitsOnly = formattedIdentifier.replace(/\D/g, "");

      // Make sure we have digits to work with
      if (digitsOnly.length > 0) {
        // If it's a Russian number (starts with +7), format accordingly
        if (formattedIdentifier.includes("+7")) {
          // Remove the country code if it's duplicated in the digits
          const phoneDigits = digitsOnly.startsWith("7")
            ? digitsOnly.substring(1)
            : digitsOnly;
          formattedIdentifier = "+7" + phoneDigits;
        } else {
          // For other numbers, ensure it has a + prefix
          formattedIdentifier =
            "+" + (digitsOnly.startsWith("1") ? digitsOnly : "1" + digitsOnly);
        }
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
        router.push("/forgot-password/success" as any);
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message;

        if (Array.isArray(message)) {
          // Берём первую ошибку и первое сообщение из constraints
          const firstError = message[0];
          const constraints = firstError?.constraints;
          const firstConstraintMsg =
            constraints && Object.values(constraints)[0];

          setError(firstConstraintMsg || t("error.required"));
        } else {
          setError(message || t("error.required"));
        }
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
          <AuthInput
            type={identifierType === "phone" ? "tel" : "email"}
            placeholder={
              identifierType === "email"
                ? t("email.placeholder")
                : t("phone.placeholder") || "Phone number"
            }
            label={
              identifierType === "email"
                ? t("email.label")
                : t("phone.label") || "Phone"
            }
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (error) setError("");
            }}
            disabled={isLoading}
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
