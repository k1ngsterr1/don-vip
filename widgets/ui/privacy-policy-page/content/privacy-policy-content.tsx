"use client";

import { useTranslations } from "next-intl";

export function PrivacyPolicyContent() {
  const t = useTranslations("privacyPolicy");

  return (
    <>
      {/* Introduction */}
      <div className="mb-8 pb-8 border-b border-gray-100">
        {t.raw("sections.intro").map((paragraph: string, index: number) => (
          <p
            key={index}
            className={`text-gray-700 leading-relaxed ${
              index > 0 ? "mt-4" : ""
            }`}
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Section 1 */}
      <div
        id="section1"
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-8"
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {t("sections.generalProvisions.title")}
        </h2>
        {t
          .raw("sections.generalProvisions.content")
          .map((paragraph: string, index: number) => (
            <p
              key={index}
              className={`text-gray-700 leading-relaxed ${
                index > 0 ? "mt-4" : ""
              } ${paragraph.startsWith("1.1.") ? "pl-6" : ""}`}
            >
              {paragraph}
            </p>
          ))}
      </div>

      {/* Section 2 */}
      <div
        id="section2"
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-8"
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {t("sections.processingPurposes.title")}
        </h2>
        {t
          .raw("sections.processingPurposes.content")
          .map((paragraph: string, index: number) => (
            <p
              key={index}
              className={`text-gray-700 leading-relaxed ${
                index > 0 ? "mt-4" : ""
              } ${paragraph.startsWith("2.2.") ? "pl-6" : ""}`}
            >
              {paragraph}
            </p>
          ))}
      </div>

      {/* Section 3 */}
      <div
        id="section3"
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-8"
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {t("sections.processingConditions.title")}
        </h2>
        {t
          .raw("sections.processingConditions.content")
          .map((paragraph: string, index: number) => (
            <p
              key={index}
              className={`text-gray-700 leading-relaxed ${
                index > 0 ? "mt-4" : ""
              }`}
            >
              {paragraph}
            </p>
          ))}
      </div>

      {/* Section 4 */}
      <div
        id="section4"
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-8"
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {t("sections.obligations.title")}
        </h2>
        {t
          .raw("sections.obligations.content")
          .map((paragraph: string, index: number) => {
            const isSubItem =
              paragraph.startsWith("4.1.") || paragraph.startsWith("4.2.");
            const isMainItem =
              paragraph === "4.1. The User is obliged to:" ||
              paragraph === "4.2. The Site Administration is obliged to:";

            return (
              <p
                key={index}
                className={`text-gray-700 leading-relaxed ${
                  index > 0 ? "mt-4" : ""
                } ${isSubItem && !isMainItem ? "pl-6" : ""}`}
              >
                {paragraph}
              </p>
            );
          })}
      </div>

      {/* Section 5 */}
      <div
        id="section5"
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-8"
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {t("sections.liability.title")}
        </h2>
        {t
          .raw("sections.liability.content")
          .map((paragraph: string, index: number) => (
            <p
              key={index}
              className={`text-gray-700 leading-relaxed ${
                index > 0 ? "mt-4" : ""
              } ${paragraph.startsWith("5.2.") ? "pl-6" : ""}`}
            >
              {paragraph}
            </p>
          ))}
      </div>

      {/* Section 6 */}
      <div
        id="section6"
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-8"
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {t("sections.disputeResolution.title")}
        </h2>
        {t
          .raw("sections.disputeResolution.content")
          .map((paragraph: string, index: number) => (
            <p
              key={index}
              className={`text-gray-700 leading-relaxed ${
                index > 0 ? "mt-4" : ""
              }`}
            >
              {paragraph}
            </p>
          ))}
      </div>

      {/* Section 7 */}
      <div id="section7" className="mb-8 scroll-mt-8">
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {t("sections.additionalTerms.title")}
        </h2>
        {t
          .raw("sections.additionalTerms.content")
          .map((paragraph: string, index: number) => (
            <p
              key={index}
              className={`text-gray-700 leading-relaxed ${
                index > 0 ? "mt-4" : ""
              }`}
            >
              {paragraph}
            </p>
          ))}
      </div>
    </>
  );
}
