"use client";

import { useTranslations } from "next-intl";

export function PrivacyPolicyContent() {
  const t = useTranslations("privacyPolicy");

  const renderParagraphs = (contentKey: string) => {
    const paragraphs = t.raw(contentKey) as string[];
    return paragraphs.map((paragraph: string, index: number) => {
      // Basic heuristic for indentation, can be improved
      const isSubItem =
        /^\d\.\d\.|\s{2,}\S/.test(paragraph) && !paragraph.endsWith(":");
      return (
        <p
          key={index}
          className={`text-gray-700 leading-relaxed ${
            index > 0 ? "mt-4" : ""
          } ${isSubItem ? "pl-6" : ""}`}
        >
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="prose prose-gray max-w-none">
      {" "}
      {/* Added prose for base styling */}
      {/* Introduction */}
      <div className="mb-8 pb-8 border-b border-gray-100">
        {renderParagraphs("sections.intro")}
      </div>
      {/* Section 1 */}
      <section
        id="section1"
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-24"
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {t("sections.generalProvisions.title")}
        </h2>
        {renderParagraphs("sections.generalProvisions.content")}
      </section>
      {/* Section 2 */}
      <section
        id="section2"
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-24"
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {t("sections.processingPurposes.title")}
        </h2>
        {renderParagraphs("sections.processingPurposes.content")}
      </section>
      {/* Section 3 */}
      <section
        id="section3"
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-24"
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {t("sections.processingConditions.title")}
        </h2>
        {renderParagraphs("sections.processingConditions.content")}
      </section>
      {/* Section 4 */}
      <section
        id="section4"
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-24"
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {t("sections.obligations.title")}
        </h2>
        {renderParagraphs("sections.obligations.content")}
      </section>
      {/* Section 5 */}
      <section
        id="section5"
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-24"
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {t("sections.liability.title")}
        </h2>
        {renderParagraphs("sections.liability.content")}
      </section>
      {/* Section 6 */}
      <section
        id="section6"
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-24"
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {t("sections.disputeResolution.title")}
        </h2>
        {renderParagraphs("sections.disputeResolution.content")}
      </section>
      {/* Section 7 */}
      <section id="section7" className="mb-8 scroll-mt-24">
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {t("sections.additionalTerms.title")}
        </h2>
        {renderParagraphs("sections.additionalTerms.content")}
      </section>
    </div>
  );
}
