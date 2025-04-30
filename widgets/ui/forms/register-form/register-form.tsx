"use client";
import { useTranslations } from "next-intl";
import { AuthInput } from "@/shared/ui/auth-input/auth-input";
import { Button } from "@/shared/ui/button/button";
import { SocialAuth } from "@/shared/ui/social-input/social-input";
import Link from "next/link";
import { useState } from "react";

export function RegisterForm() {
  const i18n = useTranslations("register-form_auth.registerForm");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const isFormFilled = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: !email ? i18n("errors.emailRequired") : undefined,
      password: !password ? i18n("errors.passwordRequired") : undefined,
      confirmPassword:
        password !== confirmPassword
          ? i18n("errors.passwordMismatch")
          : undefined,
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    alert(i18n("successMessage", { email }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          type="email"
          placeholder={i18n("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <AuthInput
          type="password"
          placeholder={i18n("passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPasswordToggle
          error={errors.password}
        />
        <AuthInput
          type="password"
          placeholder={i18n("confirmPasswordPlaceholder")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />
        <Button
          type="submit"
          className={`w-full rounded-full text-white ${
            isFormFilled
              ? "bg-blue hover:bg-blue/90"
              : "bg-[#AAAAAB] hover:bg-[#AAAAAB]/90"
          }`}
          disabled={!isFormFilled}
        >
          {i18n("submitButton")}
        </Button>
        <div className="w-full flex items-end justify-between">
          <Link
            className="text-[13px] w-full text-right text-black"
            href="/auth/forgot-password"
          >
            {i18n("forgotPassword")}
          </Link>
        </div>
      </form>
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>
          {i18n("privacyText")}{" "}
          <Link href="#" className="text-black">
            {i18n("privacyLink")}
          </Link>
        </p>
      </div>
      <SocialAuth />

      <div className="mt-8 text-center">
        <p className="text-sm">
          {i18n("haveAccountText")}{" "}
          <Link href="/auth/login" className="text-blue font-medium">
            {i18n("loginLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
