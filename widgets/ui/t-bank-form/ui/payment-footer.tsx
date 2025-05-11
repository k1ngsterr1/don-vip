"use client";

import { useTranslations } from "next-intl";

export function PaymentFooter() {
  const t = useTranslations("Payment.payment.footer");

  return (
    <div className="mt-6 text-center text-xs text-gray-500">
      <p>{t("secure")}</p>
      <p className="mt-1">
        © {new Date().getFullYear()} {t("rights")}
      </p>
    </div>
  );
}
