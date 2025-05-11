"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface SubmitButtonProps {
  isLoading: boolean;
  amount: string;
}

export function SubmitButton({ isLoading, amount }: SubmitButtonProps) {
  const t = useTranslations("Payment.payment.form.submit");

  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full flex items-center justify-center px-4 py-3 bg-[#FBC520] hover:bg-[#FAB619] text-[#3C2C0B] font-bold text-lg rounded-md transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {t("processing")}
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-5 w-5" />
          {t.rich("pay", { amount })}
        </>
      )}
    </button>
  );
}
