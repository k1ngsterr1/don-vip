"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export function PrivacyPolicyContactFooter() {
  const t = useTranslations("privacyPolicy");

  return (
    <div className="mt-8 pt-8 border-t border-gray-100">
      <div className="flex items-center">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full mr-4">
          <Mail className="text-blue w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-800">
            {t("sections.additionalTerms.content")[2].split(": ")[0]}:
          </h3>
          <a
            href={`mailto:${t("email")}`}
            className="text-blue hover:text-blue-700 transition-colors"
          >
            {t("email")}
          </a>
        </div>
      </div>
    </div>
  );
}
