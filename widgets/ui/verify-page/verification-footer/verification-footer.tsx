"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface VerificationFooterProps {
  resendCooldown: number;
  onResendCode: () => void;
  isDisabled: boolean;
}

export function VerificationFooter({
  resendCooldown,
  onResendCode,
  isDisabled,
}: VerificationFooterProps) {
  const i18n = useTranslations("verify-form_auth.verifyForm");

  return (
    <>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          <span>{i18n("noCodeText") || "Не получили код?"}</span>{" "}
          <button
            type="button"
            onClick={onResendCode}
            disabled={resendCooldown > 0 || isDisabled}
            className={`font-medium ${
              resendCooldown > 0 || isDisabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue hover:underline"
            }`}
          >
            {resendCooldown > 0 ? (
              <span>{`${
                i18n("resendIn") || "Resend in"
              } ${resendCooldown}s`}</span>
            ) : (
              i18n("resendButton") || "Отправить повторно"
            )}
          </button>
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          {i18n("backToLoginText") || "Нужно изменить email?"}{" "}
          <Link
            href="/auth/login"
            className="text-blue font-medium hover:underline"
          >
            {i18n("backToLoginLink") || "Вернуться к входу"}
          </Link>
        </p>
      </div>
    </>
  );
}
