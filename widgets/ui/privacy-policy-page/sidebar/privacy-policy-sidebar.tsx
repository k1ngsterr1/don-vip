"use client";

import { useTranslations } from "next-intl";

export function PrivacyPolicySidebar() {
  const t = useTranslations("privacyPolicy");

  const sections = [
    { id: "section1", title: t("sections.generalProvisions.title") },
    { id: "section2", title: t("sections.processingPurposes.title") },
    { id: "section3", title: t("sections.processingConditions.title") },
    { id: "section4", title: t("sections.obligations.title") },
    { id: "section5", title: t("sections.liability.title") },
    { id: "section6", title: t("sections.disputeResolution.title") },
    { id: "section7", title: t("sections.additionalTerms.title") },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{t("title")}</h3>
      <nav className="space-y-1">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="block py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
          >
            {section.title}
          </a>
        ))}
      </nav>
    </div>
  );
}
