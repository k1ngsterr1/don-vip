"use client";
import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
export default function PublicOfferContactFooter() {
  const i18n = useTranslations("PublicOfferContactFooter");

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4 shrink-0">
            <CreditCard className="text-blue-600 w-6 h-6" />{" "}
            {/* Assuming text-blue-600 */}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{i18n("title")}</h3>
            <p className="text-gray-500 text-sm">{i18n("subtitle")}</p>
          </div>
        </div>
        <a
          href={`mailto:${i18n("email")}`}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap" /* Assuming blue-600 and blue-700 */
        >
          {i18n("email")}
        </a>
      </div>
    </div>
  );
}
