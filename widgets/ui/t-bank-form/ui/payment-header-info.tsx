"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface PaymentHeaderInfoProps {
  gameName: string;
  amount: string;
  currencyName: string;
  userId?: string;
  serverId?: string;
}

export function PaymentHeaderInfo({
  gameName,
  amount,
  currencyName,
  userId,
  serverId,
}: PaymentHeaderInfoProps) {
  const t = useTranslations("Payment.payment.info");

  return (
    <div className="px-6 pb-6">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
          <Image
            src="/t-bank-icon.png"
            width={28}
            height={28}
            alt="T-Bank"
            className="object-contain"
          />
        </div>
      </div>
      <h1 className="text-xl font-medium text-center text-gray-800 mb-2">
        T-Bank Payment
      </h1>
      <p className="text-center text-gray-600 text-sm">
        {gameName} - {amount} {currencyName}
      </p>
      {userId && (
        <p className="text-center text-gray-500 text-xs mt-1">
          {t("accountId")}: {userId}
          {serverId && ` • ${t("serverId")}: ${serverId}`}
        </p>
      )}
    </div>
  );
}
