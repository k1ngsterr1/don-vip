"use client";

import { getTranslatedError } from "@/shared/utils/error-handler";
import { useTranslations } from "next-intl";

interface AuthErrorProps {
  error: any;
  locale?: string;
}

export function AuthError({ error, locale = "en" }: AuthErrorProps) {
  const t = useTranslations("auth");

  if (!error) return null;

  const errorMessage = getTranslatedError(error, t);

  return (
    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
      {errorMessage}
    </div>
  );
}
