"use client";

import { useTranslations } from "next-intl";
import { CheckCircle } from "lucide-react";
import { Button } from "@/shared/ui/button/button";
import { Link } from "@/i18n/navigation";

export default function ResetPasswordSuccessPage() {
  const i18n = useTranslations("resetPasswordSuccess");

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div
        className="max-w-md w-full mx-auto bg-white p-8 rounded-2xl shadow-lg shadow-green-100/40 space-y-6 text-center"
        style={{ boxShadow: "0 6px 32px 0 rgba(34, 197, 94, 0.08)" }}
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-unbounded mb-3 text-green-700 tracking-tight">
            {i18n("title")}
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            {i18n("description")}
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Link href="/auth/login">
            <Button className="w-full bg-blue hover:bg-blue/90 text-white py-3 rounded-full font-medium">
              {i18n("tryLogin")}
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button
              variant="secondary"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-full"
            >
              {i18n("backToHome")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
