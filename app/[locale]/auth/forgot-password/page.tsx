"use client";
import { ForgotPasswordForm } from "@/widgets/ui/forms/forgot-password/forgot-password";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const i18n = useTranslations("forgot_auth.forgotPassword");

  return (
    <main className="md:min-h-[80vh] flex items-center justify-center">
      <div className="px-4 py-6  ">
        <h1 className="text-[28px] font-unbounded text-center font-medium mb-6">
          {i18n("title")}
        </h1>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
