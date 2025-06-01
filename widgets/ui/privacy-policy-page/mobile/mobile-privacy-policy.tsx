"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function MobilePrivacyPolicy() {
  const t = useTranslations("privacyPolicy");

  const renderSection = (title: string, contentKey: string) => {
    const content = t.raw(contentKey) as string[];
    return (
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
        {content.map((paragraph, idx) => (
          <p key={idx} className="text-gray-700 mb-2 text-sm leading-relaxed">
            {paragraph}
          </p>
        ))}
      </section>
    );
  };

  return (
    <div className="w-full px-4 py-6 md:hidden">
      <Link
        href={"/"}
        className="text-blue-600 text-base font-roboto mb-4 inline-block"
      >
        {t("back")}
      </Link>
      <h1 className="text-2xl mt-2 mb-3 text-gray-800 font-unbounded font-medium">
        {t("title")}
      </h1>
      <p className="text-sm text-gray-500 mb-6">{`${t("site")} ${t(
        "date"
      )}`}</p>

      <div className="prose prose-sm max-w-none">
        <section className="mb-6">
          {(t.raw("sections.intro") as string[]).map(
            (paragraph: string, idx: number) => (
              <p
                key={idx}
                className="text-gray-700 mb-2 text-sm leading-relaxed"
              >
                {paragraph}
              </p>
            )
          )}
        </section>

        {renderSection(
          t("sections.generalProvisions.title"),
          "sections.generalProvisions.content"
        )}
        {renderSection(
          t("sections.processingPurposes.title"),
          "sections.processingPurposes.content"
        )}
        {renderSection(
          t("sections.processingConditions.title"),
          "sections.processingConditions.content"
        )}
        {renderSection(
          t("sections.obligations.title"),
          "sections.obligations.content"
        )}
        {renderSection(
          t("sections.liability.title"),
          "sections.liability.content"
        )}
        {renderSection(
          t("sections.disputeResolution.title"),
          "sections.disputeResolution.content"
        )}
        {renderSection(
          t("sections.additionalTerms.title"),
          "sections.additionalTerms.content"
        )}
      </div>
    </div>
  );
}
