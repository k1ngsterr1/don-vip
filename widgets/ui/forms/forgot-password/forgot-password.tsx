"use client";

import type React from "react";
import { useTranslations } from "next-intl";
import { AuthInput } from "@/shared/ui/auth-input/auth-input";
import { Button } from "@/shared/ui/button/button";
import { SocialAuth } from "@/shared/ui/social-input/social-input";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useChangePassword } from "@/entities/auth/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export function ForgotPasswordForm() {
  const router = useRouter();
  const t = useTranslations("forgot_auth.forgotPassword");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const locale = useLocale(); // ⬅️ получаем текущий язык (например, "ru" или "en")

  const { mutate: changePassword, isPending: isLoading } = useChangePassword();

  const isFormFilled = email.trim() !== "";

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError(t("error.required"));
      return;
    }

    if (!validateEmail(email)) {
      setError(t("error.invalidEmail"));
      return;
    }

    changePassword(
      { email, lang: locale }, // ⬅️ передаём язык вместе с email
      {
        onSuccess: () => {
          sessionStorage.setItem("resetPasswordEmail", email);
          router.push("/forgot-password/success");
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
      }
    );
  };

  return (
    <div className="max-w-md mx-auto md:bg-white md:rounded-lg md:shadow-sm md:border md:border-gray-100 md:p-8">
      <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 md:text-center">
        {t("description")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <AuthInput
          type="email"
          placeholder={t("email.placeholder")}
          label={t("email.label")}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          disabled={isLoading}
        />

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
          <Link href="#" className="text-blue hover:underline">
            {t("privacy.link")}
          </Link>
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
