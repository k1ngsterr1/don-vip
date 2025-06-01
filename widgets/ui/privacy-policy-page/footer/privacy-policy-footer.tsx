"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export function PrivacyPolicyContactFooter() {
  const t = useTranslations("privacyPolicy");
  // Attempt to get the title part from the mocked raw content if available
  const additionalTermsContent = t.raw(
    "sections.additionalTerms.content"
  ) as string[];
  const contactTitle =
    additionalTermsContent.length > 2
      ? additionalTermsContent[2].split(": ")[0] + ":"
      : "Contact Us:";

  return (
    <div className="mt-8 pt-8 border-t border-gray-100">
      <div className="flex items-center">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full mr-4 shrink-0">
          <Mail className="text-blue-600 w-5 h-5" />{" "}
          {/* Assuming text-blue-600 */}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-800">{contactTitle}</h3>
          <a
            href={`mailto:${t("email")}`}
            className="text-blue-600 hover:text-blue-700 transition-colors text-sm" // Assuming text-blue-600
          >
            {t("email")}
          </a>
        </div>
      </div>
    </div>
  );
}
