import DesktopFAQ from "@/widgets/ui/faq-page/desktop-faq/desktop-faq";
import MobileFAQ from "@/widgets/ui/faq-page/mobile-faq/mobile-faq";

export default function FAQPage() {
  return (
    <>
      <MobileFAQ />
      <DesktopFAQ />
    </>
  );
}
