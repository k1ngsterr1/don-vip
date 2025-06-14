"use client";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AuthLoadingOverlay } from "@/shared/ui/auth-loading/auth-loading";
import { useVerification } from "@/entities/auth/hooks/use-verification";
import { IdentifierModal } from "@/entities/auth/ui/identifier-popup/identifier-popup";
import { VerificationHeader } from "@/widgets/ui/verify-page/verification-header/verification-header";
import { VerificationCodeInput } from "@/widgets/ui/verify-page/verify-code-input/verify-code-input";
import { VerificationError } from "@/widgets/ui/verify-page/verification-error/verification-error";
import { VerificationSubmitButton } from "@/widgets/ui/verify-page/verification-submit-button/verification-submit-button";
import { VerificationFooter } from "@/widgets/ui/verify-page/verification-footer/verification-footer";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/shared/config/axios";
import { PhoneInputWithCountry } from "@/shared/ui/phone-input/phone-input";

function ResetPasswordForm() {
  const i18n = useTranslations("resetPassword");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [identifier, setIdentifier] = useState("");

  const mutation = useMutation({
    mutationFn: async ({
      code,
      new_password,
      identifier,
    }: {
      code: string;
      new_password: string;
      identifier: string;
    }) => {
      const res = await api.post("/user/reset-password", {
        code,
        new_password,
        identifier,
      });
      return res.data;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ code, new_password: newPassword, identifier });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg shadow-blue-100/40 space-y-6 mt-12"
      style={{ boxShadow: "0 6px 32px 0 rgba(28, 52, 255, 0.08)" }}
    >
      <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-700 tracking-tight">
        {i18n("title", { default: "Reset Password" })}
      </h2>
      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          {i18n("identifier")}
        </label>
        <PhoneInputWithCountry
          value={identifier}
          onChange={(val) => setIdentifier(val || "")}
          placeholder={i18n("identifier", { default: "Identifier" })}
        />
      </div>
      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          {i18n("code", { default: "Code" })}
        </label>
        <input
          type="text"
          className="w-full rounded-lg px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          {i18n("newPassword", { default: "New Password" })}
        </label>
        <input
          type="password"
          className="w-full rounded-lg px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      {mutation.isError && (
        <div className="text-red-600 text-sm text-center">
          {(mutation.error as any)?.message || "Unknown error"}
        </div>
      )}
      {mutation.isSuccess && (
        <div className="text-green-600 text-sm text-center">
          {i18n("success", { default: "Password reset successful!" })}
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 mt-2"
        disabled={mutation.isPending}
      >
        {mutation.isPending
          ? i18n("loading", { default: "Resetting..." })
          : i18n("submit", { default: "Reset Password" })}
      </button>
    </form>
  );
}

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

export default function ForgotPasswordPage() {
  return (
    <div>
      <ResetPasswordForm />
    </div>
  );
}
