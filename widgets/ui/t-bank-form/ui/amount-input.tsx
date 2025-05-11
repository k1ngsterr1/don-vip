"use client";

import { Coins } from "lucide-react";
import { useTranslations } from "next-intl";

interface AmountInputProps {
  amount: string;
}

export function AmountInput({ amount }: AmountInputProps) {
  const t = useTranslations("Payment.payment.form");

  return (
    <div className="space-y-2">
      <label
        htmlFor="amount"
        className="text-sm font-medium flex items-center gap-2 text-gray-700"
      >
        <Coins className="h-4 w-4 text-[#6798de]" />
        {t("amount")}
      </label>
      <input
        id="amount"
        name="amount"
        type="text"
        value={`${amount} RUB`}
        readOnly
        required
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-gray-100 transition-colors"
      />
    </div>
  );
}
