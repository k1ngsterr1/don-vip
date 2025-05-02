"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function MobilePrivacyPolicy() {
  const t = useTranslations("privacyPolicy");

  // Helper function to render sections with proper formatting
  const renderSection = (title: string, content: string[]) => {
    return (
      <>
        <strong>{title}</strong>
        <br />
        <br />
        {content.map((paragraph, idx) => (
          <span key={idx}>
            {paragraph}
            <br />
            <br />
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="w-full px-[11px] mt-[24px] flex flex-col items-start md:hidden">
      <Link href={"/"} className="text-blue text-[15px] font-roboto">
        {t("back")}
      </Link>
      <h1 className="text-[14px] mt-[16px] text-dark font-unbounded">
        {t("title")}
      </h1>
      <span className="text-[13px] text-left text-dark mt-[12px] font-roboto">
        {`${t("site")} г. Находка ${t("date")}`}
        <br />
        <br />

        {/* Introduction */}
        {t.raw("sections.intro").map((paragraph: string, idx: number) => (
          <span key={idx}>
            {paragraph}
            <br />
            <br />
          </span>
        ))}

        {/* Section 1 */}
        {renderSection(
          t("sections.generalProvisions.title"),
          t.raw("sections.generalProvisions.content")
        )}

        {/* Section 2 */}
        {renderSection(
          t("sections.processingPurposes.title"),
          t.raw("sections.processingPurposes.content")
        )}

        {/* Section 3 */}
        {renderSection(
          t("sections.processingConditions.title"),
          t.raw("sections.processingConditions.content")
        )}

        {/* Section 4 */}
        {renderSection(
          t("sections.obligations.title"),
          t.raw("sections.obligations.content")
        )}

        {/* Section 5 */}
        {renderSection(
          t("sections.liability.title"),
          t.raw("sections.liability.content")
        )}

        {/* Section 6 */}
        {renderSection(
          t("sections.disputeResolution.title"),
          t.raw("sections.disputeResolution.content")
        )}

        {/* Section 7 */}
        {renderSection(
          t("sections.additionalTerms.title"),
          t.raw("sections.additionalTerms.content")
        )}
      </span>
    </div>
  );
}
