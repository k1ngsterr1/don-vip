"use client";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AuthLoadingOverlay } from "@/shared/ui/auth-loading/auth-loading";
// Removed: import { Button } from "@/components/ui/button"

import { VerificationHeader } from "../verification-header/verification-header";
import { VerificationCodeInput } from "../verify-code-input/verify-code-input";
import { VerificationError } from "../verification-error/verification-error";
import { VerificationSubmitButton } from "../verification-submit-button/verification-submit-button";
import { VerificationFooter } from "../verification-footer/verification-footer";
import { useVerification } from "@/entities/auth/hooks/use-verification";
import { IdentifierModal } from "@/entities/auth/ui/identifier-popup/identifier-popup";

export function VerifyForm() {
  const i18n = useTranslations("verify-form_auth.verifyForm");
  const i18nModal = useTranslations("IdentifierModal");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentIdentifier, setCurrentIdentifier] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const idFromParams = searchParams.get("identifier");
    if (idFromParams) {
      setCurrentIdentifier(idFromParams);
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  }, [searchParams]);

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
  } = useVerification(
    currentIdentifier || "",
    searchParams.get("returnUrl"),
    locale
  );

  const handleModalSubmit = (newIdentifier: string) => {
    const currentReturnUrl = searchParams.get("returnUrl");
    const queryParams = new URLSearchParams();
    queryParams.set("identifier", newIdentifier);
    if (currentReturnUrl) {
      queryParams.set("returnUrl", currentReturnUrl);
    }
    router.push(`/auth/verify?${queryParams.toString()}`);
    // setIsModalOpen(false); // Not strictly needed, useEffect will handle it
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const showLoadingOverlay = isLoading || isRedirecting;
  const loadingState = isVerified
    ? "success"
    : isRedirecting
    ? "redirecting"
    : "loading";

  const isInputDisabled =
    isLoading || isRedirecting || isVerified || !currentIdentifier;
  const isButtonDisabled = !code.every((digit) => digit) || isInputDisabled;

  if (!currentIdentifier && !isModalOpen) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {i18n("identifierMissingTitle")}
        </h3>
        <p className="mb-6 text-sm text-gray-600">
          {i18n("identifierMissingText")}
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2.5 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
        >
          {i18nModal("enterIdentifierButton")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto relative">
      <IdentifierModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
      <AuthLoadingOverlay
        isVisible={showLoadingOverlay}
        //@ts-ignore
        state={loadingState}
        message={isVerified ? i18n("verificationSuccess") : undefined}
      />
      {currentIdentifier && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <VerificationHeader email={currentIdentifier} />
          <form onSubmit={handleSubmit} className="space-y-6">
            <VerificationCodeInput
              code={code}
              setCode={setCode}
              isDisabled={isInputDisabled}
              onError={setError}
              locale={locale}
              digitLabel={i18n("digitLabel")}
            />
            <VerificationError error={error} locale={locale} />
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
      )}
    </div>
  );
}
