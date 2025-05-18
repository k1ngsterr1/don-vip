"use client";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { AuthLoadingOverlay } from "@/shared/ui/auth-loading/auth-loading";

import { VerificationHeader } from "../verification-header/verification-header";
import { VerificationCodeInput } from "../verify-code-input/verify-code-input";
import { VerificationError } from "../verification-error/verification-error";
import { VerificationSubmitButton } from "../verification-submit-button/verification-submit-button";
import { VerificationFooter } from "../verification-footer/verification-footer";
import { useVerification } from "@/entities/auth/hooks/use-verification";

export function VerifyForm() {
  const i18n = useTranslations("verify-form_auth.verifyForm");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const returnUrl = searchParams.get("returnUrl");

  const {
    code,
    setCode,
    isLoading,
    isRedirecting,
    isVerified,
    error,
    setError,
    resendCooldown,
    handleSubmit,
    handleResendCode,
  } = useVerification(email, returnUrl, locale);

  // Show loading overlay when loading or redirecting
  const showLoadingOverlay = isLoading || isRedirecting;
  const loadingState = isVerified
    ? "success"
    : isRedirecting
    ? "redirecting"
    : "loading";

  const isInputDisabled = isLoading || isRedirecting || isVerified;
  const isButtonDisabled = !code.every((digit) => digit) || isInputDisabled;

  return (
    <div className="max-w-md mx-auto relative">
      {/* Reusable loading overlay */}
      <AuthLoadingOverlay
        isVisible={showLoadingOverlay}
        //@ts-ignore
        state={loadingState}
        message={
          isVerified
            ? i18n("verificationSuccess") || "Verification successful!"
            : undefined
        }
      />
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <VerificationHeader email={email} />
        <form onSubmit={handleSubmit} className="space-y-6">
          <VerificationCodeInput
            code={code}
            setCode={setCode}
            isDisabled={isInputDisabled}
            onError={setError}
            locale={locale}
            digitLabel={i18n("digitLabel") || "Verification code digit"}
          />
          <VerificationError error={error} />
          <VerificationSubmitButton
            isDisabled={isButtonDisabled}
            isLoading={isLoading}
            isRedirecting={isRedirecting}
            isVerified={isVerified}
          />
        </form>
        <VerificationFooter
          resendCooldown={resendCooldown}
          onResendCode={handleResendCode}
          isDisabled={isInputDisabled}
        />
      </div>
    </div>
  );
}
