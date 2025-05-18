"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

interface VerificationHeaderProps {
  email?: string;
}

export function VerificationHeader({ email }: VerificationHeaderProps) {
  const i18n = useTranslations("verify-form_auth.verifyForm");

  return (
    <div className="text-center mb-6">
      <div className="w-12 h-12 bg-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Mail className="h-6 w-6 text-blue" />
      </div>
      <h1 className="text-2xl font-bold mb-2 text-dark">
        {i18n("title") || "Подтвердите ваш аккаунт"}
      </h1>
      <p className="text-gray-500 mx-auto">
        {email ? (
          <span>
            {i18n("emailSentTo") || "We've sent a verification code to"}{" "}
            <span className="font-medium text-dark">{email}</span>
          </span>
        ) : (
          i18n("enterCode") || "Введите код подтверждения для продолжения"
        )}
      </p>
    </div>
  );
}
