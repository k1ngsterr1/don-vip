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

export function ForgotPasswordForm() {
  const i18n = useTranslations("forgotpassword_auth.forgotPassword");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Get password reset mutation from our auth API hooks
  const { mutate: changePassword, isPending: isLoading } = useChangePassword();

  const isFormFilled = email.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError(i18n("error.emptyFields"));
      return;
    }

    // Call password reset mutation
    changePassword(
      { email },
      {
        onSuccess: () => {
          setSuccessMessage(i18n("successMessage"));
          setError("");
        },
        onError: (error: any) => {
          setError(error.response?.data?.message || i18n("error.emptyFields"));
          setSuccessMessage("");
        },
      }
    );
  };

  return (
    <div className="max-w-md mx-auto md:bg-white md:rounded-lg md:shadow-sm md:border md:border-gray-100 md:p-8">
      <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 md:text-center">
        {i18n("description")}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <AuthInput
          type="email"
          placeholder={i18n("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label={i18n("emailLabel")}
          disabled={isLoading}
        />
        {error && <p className="text-[#ff272c] text-xs md:text-sm">{error}</p>}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 md:p-4">
            <p className="text-green-600 text-xs md:text-sm">
              {successMessage}
            </p>
          </div>
        )}
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
              {i18n("processingText") || "Processing..."}
            </span>
          ) : (
            i18n("submitButton")
          )}
        </Button>
      </form>
      <div className="mt-6 md:mt-8 text-center text-xs md:text-sm text-gray-500">
        <p>
          {i18n("privacyText")}{" "}
          <Link href="#" className="text-blue hover:underline">
            {i18n("privacyLink")}
          </Link>
        </p>
      </div>
      <SocialAuth />

      <div className="mt-8 md:mt-10 text-center">
        <p className="text-sm md:text-base">
          {i18n("rememberPassword")}{" "}
          <Link
            href="/auth/login"
            className="text-blue font-medium hover:underline"
          >
            {i18n("loginLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
