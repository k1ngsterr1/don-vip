import { DesktopPrivacyPolicy } from "@/widgets/ui/privacy-policy-page/desktop/desktop-privacy-policy";
import { MobilePrivacyPolicy } from "@/widgets/ui/privacy-policy-page/mobile/mobile-privacy-policy";

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
    <>
      <MobilePrivacyPolicy />
      <DesktopPrivacyPolicy />
    </>
  );
}
