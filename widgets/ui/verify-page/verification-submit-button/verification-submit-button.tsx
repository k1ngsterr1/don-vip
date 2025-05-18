"use client";

import { Button } from "@/shared/ui/button/button";
import { Loader2, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface VerificationSubmitButtonProps {
  isDisabled: boolean;
  isLoading: boolean;
  isRedirecting: boolean;
  isVerified: boolean;
}

export function VerificationSubmitButton({
  isDisabled,
  isLoading,
  isRedirecting,
  isVerified,
}: VerificationSubmitButtonProps) {
  const i18n = useTranslations("verify-form_auth.verifyForm");

  return (
    <Button
      type="submit"
      className="w-full rounded-full text-white py-3 text-sm bg-gray-400 hover:bg-gray-500"
      disabled={isDisabled}
      aria-label={i18n("ariaLabels.submit") || "Verify"}
    >
      {isLoading && !isVerified ? (
        <span className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isRedirecting
            ? i18n("redirectingText") || "Redirecting..."
            : i18n("loadingText") || "Verifying..."}
        </span>
      ) : isVerified ? (
        <span className="flex items-center justify-center">
          <CheckCircle className="mr-2 h-4 w-4" />
          {i18n("verifiedText") || "Verified"}
        </span>
      ) : (
        i18n("submitButton") || "Подтвердить"
      )}
    </Button>
  );
}
