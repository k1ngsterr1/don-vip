import Link from "next/link";
import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
  const i18n = useTranslations("privacyPolicy");

  const renderSection = (sectionKey: string) => {
    const section = i18n.raw(`sections.${sectionKey}`);
    return (
      <>
        <strong>{section.title}</strong>
        <br />
        <br />
        {section.content.map((paragraph: string, index: number) => (
          <span key={`${sectionKey}-${index}`}>
            {paragraph}
            <br />
            <br />
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="w-full px-[11px] mt-[24px] flex flex-col items-start">
      <Link href={"/"} className="text-blue text-[15px] font-roboto">
        {i18n("back")}
      </Link>
      <h1 className="text-[14px] mt-[16px] text-dark font-unbounded">
        {i18n("title")}
      </h1>
      <span className="text-[13px] text-left text-dark mt-[12px] font-roboto">
        {i18n("date")}
        <br />
        <br />

        {/* Введение */}
        {i18n.raw("sections.intro").map((paragraph: string, index: number) => (
          <span key={`intro-${index}`}>
            {paragraph}
            <br />
            <br />
          </span>
        ))}

        {/* Основные разделы */}
        {renderSection("generalProvisions")}
        {renderSection("processingPurposes")}
        {renderSection("processingConditions")}
        {renderSection("obligations")}
        {renderSection("liability")}
        {renderSection("disputeResolution")}
        {renderSection("additionalTerms")}
      </span>
    </div>
  );
}
