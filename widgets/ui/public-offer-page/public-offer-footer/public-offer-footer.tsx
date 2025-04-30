"use client";
import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function PublicOfferContactFooter() {
  const i18n = useTranslations("PublicOfferContactFooter");

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4">
            <CreditCard className="text-blue w-6 h-6" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{i18n("title")}</h3>
            <p className="text-gray-500">{i18n("subtitle")}</p>
          </div>
        </div>
        <Link
          href={`mailto:${i18n("email")}`}
          className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {i18n("email")}
        </Link>
      </div>
    </div>
  );
}
