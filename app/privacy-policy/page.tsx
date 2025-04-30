import { DesktopPrivacyPolicy } from "@/widgets/ui/privacy-policy-page/desktop/desktop-privacy-policy";
import { MobilePrivacyPolicy } from "@/widgets/ui/privacy-policy-page/mobile/mobile-privacy-policy";

export default function PrivacyPolicy() {
  return (
    <>
      <MobilePrivacyPolicy />
      <DesktopPrivacyPolicy />
    </>
  );
}
