"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { AuthInput } from "@/shared/ui/auth-input/auth-input";
import { Button } from "@/shared/ui/button/button";
import { SocialAuth } from "@/shared/ui/social-input/social-input";

export function LoginForm() {
  const i18n = useTranslations("login-form_auth.loginForm");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

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

    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(i18n("successMessage", { email }));
    } catch (error) {
      alert(i18n("errorMessage"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
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
          disabled={isLoading}
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
            disabled={isLoading}
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

        <Button
          type="submit"
          className={`w-full rounded-full text-white py-3 md:py-4 text-sm md:text-base ${
            isFormFilled && !isLoading
              ? "bg-blue hover:bg-blue/90"
              : "bg-[#AAAAAB] hover:bg-[#AAAAAB]/90"
          }`}
          disabled={!isFormFilled || isLoading}
          aria-label={i18n("ariaLabels.submit")}
        >
          {isLoading ? i18n("loadingText") : i18n("submitButton")}
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
