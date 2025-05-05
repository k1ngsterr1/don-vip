"use client";
import { useTranslations } from "next-intl";
import type React from "react";

import { AuthInput } from "@/shared/ui/auth-input/auth-input";
import { Button } from "@/shared/ui/button/button";
import { SocialAuth } from "@/shared/ui/social-input/social-input";
import Link from "next/link";
import { useState } from "react";
import { useRegister } from "@/entities/auth/hooks/mutations/use-auth.mutation";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthLoadingOverlay } from "@/shared/ui/auth-loading/auth-loading";

export function RegisterForm() {
  const i18n = useTranslations("register-form_auth.registerForm");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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

  const validateIdentifier = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      identifier: !identifier
        ? i18n("errors.emailRequired")
        : !validateIdentifier(identifier)
        ? i18n("errors.invalidIdentifier") ||
          "Please enter a valid email or phone number"
        : undefined,
      password: !password ? i18n("errors.passwordRequired") : undefined,
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
            router.push("/auth/register/success");
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

  // Show loading overlay when loading or redirecting
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

      <h1 className="text-3xl font-bold mb-6 text-center">
        {i18n("title") || "Регистрация"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          type="text"
          placeholder="Email or phone number"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            if (errors.identifier)
              setErrors((prev) => ({ ...prev, identifier: undefined }));
          }}
          error={errors.identifier}
          disabled={showLoadingOverlay}
        />

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
          disabled={showLoadingOverlay}
        />

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
            {i18n("forgotPassword") || "Забыли пароль?"}
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
            i18n("submitButton") || "Зарегистрироваться"
          )}
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-600 text-sm">
            {i18n("orContinueWith") || "или продолжить с помощью"}
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
      </div>

      <SocialAuth />

      <div className="mt-6 text-center text-xs text-gray-500">
        <p>
          {i18n("privacyText") ||
            "Регистрируясь в сервисе, вы соглашаетесь с нашей"}{" "}
          <Link href="#" className="text-black">
            {i18n("privacyLink") || "политикой конфиденциальности"}
          </Link>
        </p>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm">
          {i18n("haveAccountText") || "Уже есть аккаунт?"}{" "}
          <Link href="/auth/login" className="text-blue-600 font-medium">
            {i18n("loginLink") || "Войти"}
          </Link>
        </p>
      </div>
    </div>
  );
}
